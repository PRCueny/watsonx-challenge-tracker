/**
 * IBM watsonx Challenge Ideas Tracker - Summary Page Logic
 * Handles display and interaction for the main use cases listing page
 */

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    loadUseCases();
    setupSearchListener();
});

/**
 * Load and display all use cases
 */
function loadUseCases(searchTerm = '') {
    const useCases = searchTerm 
        ? StorageManager.searchUseCases(searchTerm)
        : StorageManager.getAllUseCases();
    
    const container = document.getElementById('useCasesContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Update stats
    updateStats(useCases);
    
    // Show empty state if no use cases
    if (useCases.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Sort by most recent first
    useCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Generate HTML for use cases
    container.innerHTML = `
        <div class="grid grid-2">
            ${useCases.map(useCase => createUseCaseCard(useCase)).join('')}
        </div>
    `;
}

/**
 * Create HTML for a single use case card
 */
function createUseCaseCard(useCase) {
    const createdDate = new Date(useCase.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const teamSize = useCase.teamMembers ? useCase.teamMembers.length : 0;
    
    // Truncate long text for preview
    const scopePreview = truncateText(useCase.scope || '', 150);
    const benefitsPreview = truncateText(useCase.benefits || '', 100);
    
    return `
        <div class="card">
            <h3 class="card-title">${escapeHtml(useCase.name)}</h3>
            <div class="card-meta">
                📅 ${createdDate} • 👥 ${teamSize} team member${teamSize !== 1 ? 's' : ''}
            </div>
            <div class="card-content">
                <p><strong>Scope:</strong> ${escapeHtml(scopePreview)}</p>
                ${benefitsPreview ? `<p><strong>Benefits:</strong> ${escapeHtml(benefitsPreview)}</p>` : ''}
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <a href="detail.html?id=${useCase.id}" class="btn btn-primary">View Details</a>
                <button onclick="editUseCase('${useCase.id}')" class="btn btn-ghost">Edit</button>
                <button onclick="deleteUseCase('${useCase.id}')" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `;
}

/**
 * Update statistics display
 */
function updateStats(useCases) {
    const totalUseCases = useCases.length;
    const totalTeams = useCases.length; // Each use case represents one team
    
    // Count total team members
    const totalMembers = useCases.reduce((sum, uc) => {
        return sum + (uc.teamMembers ? uc.teamMembers.length : 0);
    }, 0);
    
    document.getElementById('totalUseCases').textContent = totalUseCases;
    document.getElementById('totalTeams').textContent = totalTeams;
    document.getElementById('totalMembers').textContent = totalMembers;
}

/**
 * Setup search input listener
 */
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        // Debounce search to avoid too many updates
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadUseCases(e.target.value.trim());
        }, 300);
    });
}

/**
 * Edit use case - redirect to form with ID
 */
function editUseCase(id) {
    window.location.href = `form.html?id=${id}`;
}

/**
 * Delete use case with confirmation
 */
function deleteUseCase(id) {
    const useCase = StorageManager.getUseCaseById(id);
    
    if (!useCase) {
        alert('Use case not found.');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${useCase.name}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        const success = StorageManager.deleteUseCase(id);
        
        if (success) {
            // Reload the page to show updated list
            loadUseCases();
            alert('Use case deleted successfully.');
        } else {
            alert('Error deleting use case. Please try again.');
        }
    }
}

/**
 * Export all data as JSON file
 */
function exportData() {
    const jsonData = StorageManager.exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `watsonx-use-cases-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
}

/**
 * Import data from JSON file
 */
function importData() {
    const fileInput = document.getElementById('importFileInput');
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const jsonData = event.target.result;
                
                // Ask user if they want to merge or replace
                const merge = confirm(
                    'Do you want to MERGE the imported data with existing data?\n\n' +
                    'Click OK to merge (keep existing + add new)\n' +
                    'Click Cancel to replace (delete existing)'
                );
                
                const result = StorageManager.importData(jsonData, merge);
                
                if (result.success) {
                    alert(result.message);
                    loadUseCases(); // Reload to show imported data
                } else {
                    alert('Import failed: ' + result.message);
                }
            } catch (error) {
                alert('Error reading file. Please ensure it is a valid JSON file.');
                console.error('Import error:', error);
            }
            
            // Reset file input
            fileInput.value = '';
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}

/**
 * Import data from CSV file (Airtable export)
 */
async function importFromCSV() {
    const fileInput = document.getElementById('csvFileInput');
    
    if (!fileInput) {
        alert('CSV file input not found. Please refresh the page.');
        return;
    }
    
    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Show loading message
        const loadingMsg = 'Importing CSV data...';
        console.log(loadingMsg);
        
        try {
            // Import CSV using CSVImporter
            const result = await CSVImporter.importFromCSV(file);
            
            if (result.success) {
                alert(`✅ Success!\n\n${result.message}\n\nThe page will now refresh to show the imported data.`);
                loadUseCases(); // Reload to show imported data
            } else {
                alert('❌ Import failed:\n\n' + result.message);
            }
        } catch (error) {
            alert('❌ Error importing CSV file:\n\n' + error.message);
            console.error('CSV import error:', error);
        }
        
        // Reset file input
        fileInput.value = '';
    };
    
    fileInput.click();
}

/**
 * Utility: Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Utility: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Made with Bob
