/**
 * IBM watsonx Challenge Ideas Tracker - CSV Import from Airtable
 * Handles importing use cases from Airtable CSV exports
 */

const CSVImporter = {
    /**
     * Parse CSV file and import use cases
     * @param {File} file - CSV file from Airtable export
     * @returns {Promise<Object>} Result object with success status and message
     */
    async importFromCSV(file) {
        try {
            const text = await this.readFileAsText(file);
            const useCases = this.parseCSV(text);
            
            if (useCases.length === 0) {
                return {
                    success: false,
                    message: 'No valid use cases found in CSV file.'
                };
            }
            
            // Save to storage
            const existingUseCases = StorageManager.getAllUseCases();
            const newUseCases = [];
            
            useCases.forEach(useCase => {
                const saved = StorageManager.saveUseCase(useCase);
                newUseCases.push(saved);
            });
            
            return {
                success: true,
                message: `Successfully imported ${newUseCases.length} use case(s) from CSV.`,
                count: newUseCases.length
            };
        } catch (error) {
            console.error('Error importing CSV:', error);
            return {
                success: false,
                message: `Error importing CSV: ${error.message}`
            };
        }
    },
    
    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File contents as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },
    
    /**
     * Parse CSV text into use case objects
     * @param {string} csvText - CSV file contents
     * @returns {Array} Array of use case objects
     */
    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            throw new Error('CSV file is empty or invalid');
        }
        
        // Parse header row
        const headers = this.parseCSVLine(lines[0]);
        const headerMap = this.mapHeaders(headers);
        
        // Parse data rows
        const useCases = [];
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCSVLine(lines[i]);
                const useCase = this.createUseCaseFromRow(headerMap, values);
                if (useCase) {
                    useCases.push(useCase);
                }
            } catch (error) {
                console.warn(`Skipping row ${i + 1}:`, error.message);
            }
        }
        
        return useCases;
    },
    
    /**
     * Parse a single CSV line, handling quoted fields
     * @param {string} line - CSV line
     * @returns {Array} Array of field values
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        result.push(current.trim());
        
        return result;
    },
    
    /**
     * Map CSV headers to expected field names
     * @param {Array} headers - Array of header names from CSV
     * @returns {Object} Map of field indices
     */
    mapHeaders(headers) {
        const map = {};
        
        headers.forEach((header, index) => {
            const normalized = header.toLowerCase().trim();
            
            // Map Airtable column names to our field names
            if (normalized.includes('use case name') || normalized === 'name') {
                map.name = index;
            } else if (normalized === 'scope') {
                map.scope = index;
            } else if (normalized === 'benefits') {
                map.benefits = index;
            } else if (normalized === 'outputs') {
                map.outputs = index;
            } else if (normalized === 'team name') {
                map.teamName = index;
            } else if (normalized.includes('team lead email') || normalized === 'lead email') {
                map.teamLeadEmail = index;
            } else if (normalized.includes('team member emails') || normalized === 'member emails') {
                map.teamMemberEmails = index;
            } else if (normalized === 'comments' || normalized === 'notes') {
                map.comments = index;
            }
        });
        
        return map;
    },
    
    /**
     * Create a use case object from CSV row
     * @param {Object} headerMap - Map of field indices
     * @param {Array} values - Array of field values
     * @returns {Object|null} Use case object or null if invalid
     */
    createUseCaseFromRow(headerMap, values) {
        // Validate required fields
        if (headerMap.name === undefined || !values[headerMap.name]) {
            return null; // Skip rows without a name
        }
        
        // Build team members array
        const teamMembers = [];
        
        // Add team lead if present
        if (headerMap.teamLeadEmail !== undefined && values[headerMap.teamLeadEmail]) {
            const leadEmail = values[headerMap.teamLeadEmail].trim();
            if (leadEmail) {
                teamMembers.push({
                    email: leadEmail,
                    name: '',
                    title: 'Team Lead',
                    photo: ''
                });
            }
        }
        
        // Add team members if present
        if (headerMap.teamMemberEmails !== undefined && values[headerMap.teamMemberEmails]) {
            const memberEmails = values[headerMap.teamMemberEmails]
                .split(/[,;]/) // Split by comma or semicolon
                .map(email => email.trim())
                .filter(email => email && email.includes('@'));
            
            memberEmails.forEach(email => {
                // Don't duplicate the team lead
                if (!teamMembers.some(tm => tm.email === email)) {
                    teamMembers.push({
                        email: email,
                        name: '',
                        title: '',
                        photo: ''
                    });
                }
            });
        }
        
        // Create use case object
        const useCase = {
            name: values[headerMap.name] || '',
            scope: values[headerMap.scope] || '',
            benefits: values[headerMap.benefits] || '',
            outputs: values[headerMap.outputs] || '',
            comments: values[headerMap.comments] || '',
            teamMembers: teamMembers
        };
        
        // Add team name if present
        if (headerMap.teamName !== undefined && values[headerMap.teamName]) {
            useCase.teamName = values[headerMap.teamName];
        }
        
        return useCase;
    },
    
    /**
     * Download a sample CSV template
     */
    downloadTemplate() {
        const template = [
            'Use Case Name,Scope,Benefits,Outputs,Team Name,Team Lead Email,Team Member Emails,Comments',
            'Example Use Case,Detailed scope description,Expected benefits,Deliverables and outcomes,Team Alpha,lead@ibm.com,"member1@ibm.com,member2@ibm.com",Optional notes'
        ].join('\n');
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'watsonx-use-case-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Make CSVImporter available globally
if (typeof window !== 'undefined') {
    window.CSVImporter = CSVImporter;
}

// Made with Bob
