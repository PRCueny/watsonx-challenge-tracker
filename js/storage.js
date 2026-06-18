/**
 * IBM watsonx Challenge Ideas Tracker - Data Storage Layer
 * Manages localStorage operations for use cases and team members
 */

const StorageManager = {
    STORAGE_KEY: 'watsonx_use_cases',
    
    /**
     * Get all use cases from localStorage
     * @returns {Array} Array of use case objects
     */
    getAllUseCases() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },
    
    /**
     * Get a single use case by ID
     * @param {string} id - Use case ID
     * @returns {Object|null} Use case object or null if not found
     */
    getUseCaseById(id) {
        const useCases = this.getAllUseCases();
        return useCases.find(uc => uc.id === id) || null;
    },
    
    /**
     * Save a new use case
     * @param {Object} useCase - Use case object
     * @returns {Object} Saved use case with generated ID
     */
    saveUseCase(useCase) {
        const useCases = this.getAllUseCases();
        const newUseCase = {
            ...useCase,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        useCases.push(newUseCase);
        this.saveAllUseCases(useCases);
        return newUseCase;
    },
    
    /**
     * Update an existing use case
     * @param {string} id - Use case ID
     * @param {Object} updates - Updated fields
     * @returns {Object|null} Updated use case or null if not found
     */
    updateUseCase(id, updates) {
        const useCases = this.getAllUseCases();
        const index = useCases.findIndex(uc => uc.id === id);
        
        if (index === -1) return null;
        
        useCases[index] = {
            ...useCases[index],
            ...updates,
            id: useCases[index].id, // Preserve original ID
            createdAt: useCases[index].createdAt, // Preserve creation date
            updatedAt: new Date().toISOString()
        };
        
        this.saveAllUseCases(useCases);
        return useCases[index];
    },
    
    /**
     * Delete a use case
     * @param {string} id - Use case ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteUseCase(id) {
        const useCases = this.getAllUseCases();
        const filteredUseCases = useCases.filter(uc => uc.id !== id);
        
        if (filteredUseCases.length === useCases.length) {
            return false; // Use case not found
        }
        
        this.saveAllUseCases(filteredUseCases);
        return true;
    },
    
    /**
     * Save all use cases to localStorage
     * @param {Array} useCases - Array of use case objects
     */
    saveAllUseCases(useCases) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(useCases));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Error saving data. Please check your browser storage settings.');
        }
    },
    
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'uc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Export all data as JSON
     * @returns {string} JSON string of all use cases
     */
    exportData() {
        const useCases = this.getAllUseCases();
        return JSON.stringify(useCases, null, 2);
    },
    
    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string of use cases
     * @param {boolean} merge - If true, merge with existing data; if false, replace
     * @returns {Object} Result object with success status and message
     */
    importData(jsonData, merge = false) {
        try {
            const importedUseCases = JSON.parse(jsonData);
            
            if (!Array.isArray(importedUseCases)) {
                return { success: false, message: 'Invalid data format. Expected an array of use cases.' };
            }
            
            let finalUseCases;
            if (merge) {
                const existingUseCases = this.getAllUseCases();
                const existingIds = new Set(existingUseCases.map(uc => uc.id));
                
                // Add only new use cases (avoid duplicates)
                const newUseCases = importedUseCases.filter(uc => !existingIds.has(uc.id));
                finalUseCases = [...existingUseCases, ...newUseCases];
            } else {
                finalUseCases = importedUseCases;
            }
            
            this.saveAllUseCases(finalUseCases);
            return { 
                success: true, 
                message: `Successfully imported ${importedUseCases.length} use case(s).` 
            };
        } catch (error) {
            console.error('Error importing data:', error);
            return { 
                success: false, 
                message: 'Error importing data. Please check the file format.' 
            };
        }
    },
    
    /**
     * Clear all data (use with caution)
     */
    clearAllData() {
        if (confirm('Are you sure you want to delete all use cases? This action cannot be undone.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        }
        return false;
    },
    
    /**
     * Search use cases by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Filtered use cases
     */
    searchUseCases(keyword) {
        const useCases = this.getAllUseCases();
        const lowerKeyword = keyword.toLowerCase();
        
        return useCases.filter(uc => {
            return (
                uc.name?.toLowerCase().includes(lowerKeyword) ||
                uc.scope?.toLowerCase().includes(lowerKeyword) ||
                uc.benefits?.toLowerCase().includes(lowerKeyword) ||
                uc.outputs?.toLowerCase().includes(lowerKeyword) ||
                uc.comments?.toLowerCase().includes(lowerKeyword) ||
                uc.teamMembers?.some(tm => 
                    tm.email?.toLowerCase().includes(lowerKeyword) ||
                    tm.name?.toLowerCase().includes(lowerKeyword)
                )
            );
        });
    }
};

// Make StorageManager available globally
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}

// Made with Bob
