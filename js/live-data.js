/**
 * IBM watsonx Challenge Ideas Tracker - Live Data Page
 * Loads data from static JSON file (no login required)
 */

// Store all use cases globally for modal access
let allUseCases = [];

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    loadUseCases();
    setupSearchListener();
    setupModalCloseOnOutsideClick();
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
        
        allUseCases = await response.json();
        let useCases = [...allUseCases];
        
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
 * Extract name from email address
 */
function getNameFromEmail(email) {
    if (!email) return '';
    
    // Remove any whitespace/newlines
    email = email.trim();
    
    // Get the part before @
    const localPart = email.split('@')[0];
    
    // Split by dots or underscores
    const parts = localPart.split(/[._]/);
    
    // Capitalize each part
    const name = parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    
    return name;
}

/**
 * View use case details in modal
 */
function viewDetails(id) {
    const useCase = allUseCases.find(uc => uc.id === id);
    if (!useCase) {
        alert('Use case not found');
        return;
    }
    
    // Set modal title
    document.getElementById('modalTitle').textContent = useCase.name;
    
    // Build modal content
    const createdDate = new Date(useCase.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let modalContent = `
        <div style="margin-bottom: 1.5rem;">
            <p style="color: #666; font-size: 0.9rem;">
                📅 Created: ${createdDate}
                ${useCase.teamName ? ` • 🏢 Team: ${escapeHtml(useCase.teamName)}` : ''}
            </p>
        </div>
    `;
    
    // Scope
    if (useCase.scope) {
        modalContent += `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">📋 Scope</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(useCase.scope)}</p>
            </div>
        `;
    }
    
    // Benefits
    if (useCase.benefits) {
        modalContent += `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">✨ Benefits</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(useCase.benefits)}</p>
            </div>
        `;
    }
    
    // Outputs
    if (useCase.outputs) {
        modalContent += `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">📊 Expected Outputs</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(useCase.outputs)}</p>
            </div>
        `;
    }
    
    // Comments
    if (useCase.comments) {
        modalContent += `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">💬 Additional Comments</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(useCase.comments)}</p>
            </div>
        `;
    }
    
    // Team Members
    if (useCase.teamMembers && useCase.teamMembers.length > 0) {
        // Separate team lead from other members
        const teamLead = useCase.teamMembers[0];
        const otherMembers = useCase.teamMembers.slice(1);
        
        // Team Lead
        if (teamLead && teamLead.email) {
            const leadName = teamLead.name || getNameFromEmail(teamLead.email);
            modalContent += `
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">👤 Team Lead</h3>
                    <div style="padding: 0.75rem; background: #f4f4f4; border-radius: 4px;">
                        <strong>${escapeHtml(leadName)}</strong>
                        <br><a href="mailto:${escapeHtml(teamLead.email.trim())}" style="color: #0f62fe;">${escapeHtml(teamLead.email.trim())}</a>
                    </div>
                </div>
            `;
        }
        
        // Other Team Members
        if (otherMembers.length > 0) {
            modalContent += `
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: #0f62fe; margin-bottom: 0.5rem;">👥 Team Members (${otherMembers.length})</h3>
                    <div style="display: grid; gap: 0.5rem;">
                        ${otherMembers.map(member => {
                            if (!member.email) return '';
                            const memberName = member.name || getNameFromEmail(member.email);
                            return `
                                <div style="padding: 0.75rem; background: #f4f4f4; border-radius: 4px;">
                                    <strong>${escapeHtml(memberName)}</strong>
                                    <br><a href="mailto:${escapeHtml(member.email.trim())}" style="color: #0f62fe;">${escapeHtml(member.email.trim())}</a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Set modal body content
    document.getElementById('modalBody').innerHTML = modalContent;
    
    // Show modal
    document.getElementById('detailsModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Close the modal
 */
function closeModal() {
    document.getElementById('detailsModal').classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Setup click outside modal to close
 */
function setupModalCloseOnOutsideClick() {
    document.getElementById('detailsModal').addEventListener('click', function(e) {
        if (e.target.id === 'detailsModal') {
            closeModal();
        }
    });
    
    // Also close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
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
