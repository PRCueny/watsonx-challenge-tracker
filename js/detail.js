/**
 * IBM watsonx Challenge Ideas Tracker - Detail Page Logic
 * Handles display and editing of individual use case details
 */

let currentUseCaseId = null;
let currentEditingMemberIndex = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentUseCaseId = urlParams.get('id');
    
    if (!currentUseCaseId) {
        showError();
        return;
    }
    
    loadUseCase(currentUseCaseId);
});

/**
 * Load and display use case details
 */
function loadUseCase(id) {
    const useCase = StorageManager.getUseCaseById(id);
    
    if (!useCase) {
        showError();
        return;
    }
    
    // Hide loading, show content
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('contentContainer').classList.remove('hidden');
    
    // Populate use case details
    document.getElementById('useCaseTitle').textContent = useCase.name;
    
    // Format metadata
    const createdDate = new Date(useCase.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const updatedDate = new Date(useCase.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let metaText = `📅 Created: ${createdDate}`;
    if (useCase.createdAt !== useCase.updatedAt) {
        metaText += ` • Last updated: ${updatedDate}`;
    }
    document.getElementById('useCaseMeta').textContent = metaText;
    
    // Populate content sections
    document.getElementById('scopeContent').textContent = useCase.scope || 'No scope provided.';
    document.getElementById('benefitsContent').textContent = useCase.benefits || 'No benefits provided.';
    document.getElementById('outputsContent').textContent = useCase.outputs || 'No outputs provided.';
    
    // Handle comments section
    if (useCase.comments && useCase.comments.trim()) {
        document.getElementById('commentsContent').textContent = useCase.comments;
        document.getElementById('commentsSection').style.display = 'block';
    } else {
        document.getElementById('commentsSection').style.display = 'none';
    }
    
    // Load team members
    loadTeamMembers(useCase.teamMembers || []);
}

/**
 * Load and display team members
 */
function loadTeamMembers(teamMembers) {
    const container = document.getElementById('teamMembersContainer');
    
    if (teamMembers.length === 0) {
        container.innerHTML = '<p style="color: var(--ibm-gray-70);">No team members added yet.</p>';
        return;
    }
    
    container.innerHTML = teamMembers.map((member, index) => {
        const displayName = member.name || 'Name not provided';
        const displayTitle = member.title || 'Title not provided';
        const photoSrc = member.photo || 'assets/placeholder-avatar.svg';
        
        return `
            <div class="team-member" onclick="openEditModal(${index})" style="cursor: pointer;">
                <img
                    src="${photoSrc}"
                    alt="${escapeHtml(displayName)}"
                    class="team-member-photo"
                    onerror="this.src='assets/placeholder-avatar.svg'"
                >
                <div class="team-member-name">${escapeHtml(displayName)}</div>
                <div class="team-member-title">${escapeHtml(displayTitle)}</div>
                <div class="team-member-email">${escapeHtml(member.email)}</div>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--ibm-gray-50);">
                    Click to edit
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Open edit modal for team member
 */
function openEditModal(memberIndex) {
    const useCase = StorageManager.getUseCaseById(currentUseCaseId);
    if (!useCase || !useCase.teamMembers || !useCase.teamMembers[memberIndex]) {
        alert('Error loading team member data.');
        return;
    }
    
    currentEditingMemberIndex = memberIndex;
    const member = useCase.teamMembers[memberIndex];
    
    // Populate modal fields
    document.getElementById('modalEmail').value = member.email;
    document.getElementById('modalName').value = member.name || '';
    document.getElementById('modalTitle').value = member.title || '';
    
    // Show photo preview if exists
    const photoPreview = document.getElementById('photoPreview');
    if (member.photo) {
        photoPreview.innerHTML = `
            <img src="${member.photo}" alt="Current photo" style="max-width: 150px; border-radius: 50%;">
            <p style="font-size: 0.75rem; color: var(--ibm-gray-70); margin-top: 0.5rem;">Current photo</p>
        `;
    } else {
        photoPreview.innerHTML = '';
    }
    
    // Show modal
    const modal = document.getElementById('editMemberModal');
    modal.style.display = 'flex';
}

/**
 * Close edit modal
 */
function closeEditModal() {
    const modal = document.getElementById('editMemberModal');
    modal.style.display = 'none';
    currentEditingMemberIndex = null;
    
    // Clear file input
    document.getElementById('modalPhoto').value = '';
    document.getElementById('photoPreview').innerHTML = '';
}

/**
 * Save team member edits
 */
function saveMemberEdit() {
    const useCase = StorageManager.getUseCaseById(currentUseCaseId);
    if (!useCase || currentEditingMemberIndex === null) {
        alert('Error saving changes.');
        return;
    }
    
    const name = document.getElementById('modalName').value.trim();
    const title = document.getElementById('modalTitle').value.trim();
    const photoInput = document.getElementById('modalPhoto');
    
    // Update member data
    const member = useCase.teamMembers[currentEditingMemberIndex];
    member.name = name;
    member.title = title;
    
    // Handle photo upload
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            member.photo = e.target.result;
            
            // Save updated use case
            const updated = StorageManager.updateUseCase(currentUseCaseId, {
                teamMembers: useCase.teamMembers
            });
            
            if (updated) {
                closeEditModal();
                loadUseCase(currentUseCaseId);
                alert('Team member updated successfully!');
            } else {
                alert('Error saving changes. Please try again.');
            }
        };
        
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        // No new photo, just save other changes
        const updated = StorageManager.updateUseCase(currentUseCaseId, {
            teamMembers: useCase.teamMembers
        });
        
        if (updated) {
            closeEditModal();
            loadUseCase(currentUseCaseId);
            alert('Team member updated successfully!');
        } else {
            alert('Error saving changes. Please try again.');
        }
    }
}

/**
 * Edit use case - redirect to form
 */
function editUseCase() {
    window.location.href = `form.html?id=${currentUseCaseId}`;
}

/**
 * Delete use case with confirmation
 */
function deleteUseCase() {
    const useCase = StorageManager.getUseCaseById(currentUseCaseId);
    
    if (!useCase) {
        alert('Use case not found.');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${useCase.name}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        const success = StorageManager.deleteUseCase(currentUseCaseId);
        
        if (success) {
            alert('Use case deleted successfully.');
            window.location.href = 'index.html';
        } else {
            alert('Error deleting use case. Please try again.');
        }
    }
}

/**
 * Show error state
 */
function showError() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
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

/**
 * Close modal when clicking outside
 */
document.getElementById('editMemberModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditModal();
    }
});

// Made with Bob
