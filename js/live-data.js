/**
 * IBM watsonx Challenge Ideas Tracker - Live Data Page
 * Loads data from static JSON file (no login required)
 */

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    loadUseCases();
    setupSearchListener();
});

/**
 * Load and display all use cases from JSON file
 */
async function loadUseCases(searchTerm = '') {
    try {
        // Show loading state
        const container = document.getElementById('useCasesContainer');
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading data...</div>';
        
        // Fetch data from JSON file
        const response = await fetch('data/airtable-data.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        
        let useCases = await response.json();
        
        // Filter by search term if provided
        if (searchTerm) {
            const lowerKeyword = searchTerm.toLowerCase();
            useCases = useCases.filter(uc => {
                return (
                    uc.name?.toLowerCase().includes(lowerKeyword) ||
                    uc.scope?.toLowerCase().includes(lowerKeyword) ||
                    uc.benefits?.toLowerCase().includes(lowerKeyword) ||
                    uc.outputs?.toLowerCase().includes(lowerKeyword) ||
                    uc.comments?.toLowerCase().includes(lowerKeyword) ||
                    uc.teamName?.toLowerCase().includes(lowerKeyword) ||
                    uc.teamMembers?.some(tm => 
                        tm.email?.toLowerCase().includes(lowerKeyword) ||
                        tm.name?.toLowerCase().includes(lowerKeyword)
                    )
                );
            });
        }
        
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
    } catch (error) {
        console.error('Error loading use cases:', error);
        const container = document.getElementById('useCasesContainer');
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: red;">Error loading data. Please refresh the page.</div>';
    }
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
                ${useCase.teamName ? ` • 🏢 ${escapeHtml(useCase.teamName)}` : ''}
            </div>
            <div class="card-content">
                <p><strong>Scope:</strong> ${escapeHtml(scopePreview)}</p>
                ${benefitsPreview ? `<p><strong>Benefits:</strong> ${escapeHtml(benefitsPreview)}</p>` : ''}
            </div>
            <div style="margin-top: 1rem;">
                <button onclick="viewDetails('${useCase.id}')" class="btn btn-primary">View Details</button>
            </div>
        </div>
    `;
}

/**
 * View use case details
 */
function viewDetails(id) {
    // For now, show an alert with the ID
    // You can enhance this to show a modal or navigate to a detail page
    alert(`View details for use case: ${id}\n\nThis feature can be enhanced to show full details in a modal or separate page.`);
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
