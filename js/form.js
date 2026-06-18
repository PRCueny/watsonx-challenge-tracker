/**
 * IBM watsonx Challenge Ideas Tracker - Form Logic
 * Handles use case submission and editing
 */

let editingId = null;

// Initialize form on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're editing an existing use case
    const urlParams = new URLSearchParams(window.location.search);
    editingId = urlParams.get('id');
    
    if (editingId) {
        loadUseCaseForEdit(editingId);
    } else {
        // Add initial email field for new use case
        addEmailField();
    }
    
    // Setup form submission
    document.getElementById('useCaseForm').addEventListener('submit', handleSubmit);
});

/**
 * Load use case data for editing
 */
function loadUseCaseForEdit(id) {
    const useCase = StorageManager.getUseCaseById(id);
    
    if (!useCase) {
        alert('Use case not found. Redirecting to form...');
        window.location.href = 'form.html';
        return;
    }
    
    // Update page title
    document.getElementById('pageTitle').textContent = 'Edit Use Case';
    document.getElementById('submitBtn').innerHTML = '💾 Update Use Case';
    
    // Populate form fields
    document.getElementById('useCaseName').value = useCase.name || '';
    document.getElementById('scope').value = useCase.scope || '';
    document.getElementById('benefits').value = useCase.benefits || '';
    document.getElementById('outputs').value = useCase.outputs || '';
    document.getElementById('comments').value = useCase.comments || '';
    
    // Populate team member emails
    if (useCase.teamMembers && useCase.teamMembers.length > 0) {
        useCase.teamMembers.forEach(member => {
            addEmailField(member.email);
        });
    } else {
        addEmailField();
    }
}

/**
 * Add email input field
 */
function addEmailField(value = '') {
    const emailList = document.getElementById('emailList');
    const emailItem = document.createElement('div');
    emailItem.className = 'email-item';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-input';
    emailInput.placeholder = 'team.member@ibm.com';
    emailInput.required = true;
    emailInput.value = value;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-danger';
    removeBtn.textContent = '✖️ Remove';
    removeBtn.onclick = function() {
        // Keep at least one email field
        if (emailList.children.length > 1) {
            emailList.removeChild(emailItem);
        } else {
            alert('At least one team member email is required.');
        }
    };
    
    emailItem.appendChild(emailInput);
    emailItem.appendChild(removeBtn);
    emailList.appendChild(emailItem);
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Collect form data
    const formData = {
        name: document.getElementById('useCaseName').value.trim(),
        scope: document.getElementById('scope').value.trim(),
        benefits: document.getElementById('benefits').value.trim(),
        outputs: document.getElementById('outputs').value.trim(),
        comments: document.getElementById('comments').value.trim(),
        teamMembers: collectTeamMembers()
    };
    
    // Validate form data
    if (!validateForm(formData)) {
        return;
    }
    
    // Save or update use case
    try {
        if (editingId) {
            // Update existing use case
            const updated = StorageManager.updateUseCase(editingId, formData);
            if (updated) {
                alert('Use case updated successfully!');
                window.location.href = `detail.html?id=${editingId}`;
            } else {
                alert('Error updating use case. Please try again.');
            }
        } else {
            // Create new use case
            const saved = StorageManager.saveUseCase(formData);
            if (saved) {
                alert('Use case submitted successfully!');
                window.location.href = `detail.html?id=${saved.id}`;
            } else {
                alert('Error saving use case. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error saving use case:', error);
        alert('An error occurred. Please try again.');
    }
}

/**
 * Collect team member emails from form
 */
function collectTeamMembers() {
    const emailInputs = document.querySelectorAll('#emailList input[type="email"]');
    const teamMembers = [];
    
    emailInputs.forEach(input => {
        const email = input.value.trim();
        if (email) {
            // Check if this team member already has additional data (when editing)
            const existingMember = editingId ? findExistingTeamMember(email) : null;
            
            teamMembers.push({
                email: email,
                name: existingMember?.name || '',
                title: existingMember?.title || '',
                photo: existingMember?.photo || ''
            });
        }
    });
    
    return teamMembers;
}

/**
 * Find existing team member data when editing
 */
function findExistingTeamMember(email) {
    if (!editingId) return null;
    
    const useCase = StorageManager.getUseCaseById(editingId);
    if (!useCase || !useCase.teamMembers) return null;
    
    return useCase.teamMembers.find(member => member.email === email);
}

/**
 * Validate form data
 */
function validateForm(data) {
    let isValid = true;
    
    // Validate use case name
    if (!data.name || data.name.length < 3) {
        showError('nameError', 'Use case name must be at least 3 characters long.');
        isValid = false;
    }
    
    // Validate scope
    if (!data.scope || data.scope.length < 10) {
        showError('scopeError', 'Scope must be at least 10 characters long.');
        isValid = false;
    }
    
    // Validate benefits
    if (!data.benefits || data.benefits.length < 10) {
        showError('benefitsError', 'Benefits must be at least 10 characters long.');
        isValid = false;
    }
    
    // Validate outputs
    if (!data.outputs || data.outputs.length < 10) {
        showError('outputsError', 'Outputs must be at least 10 characters long.');
        isValid = false;
    }
    
    // Validate team members
    if (!data.teamMembers || data.teamMembers.length === 0) {
        showError('emailError', 'At least one team member email is required.');
        isValid = false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = data.teamMembers.filter(member => !emailRegex.test(member.email));
    if (invalidEmails.length > 0) {
        showError('emailError', 'Please enter valid email addresses for all team members.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
}

/**
 * Cancel form and return to summary
 */
function cancelForm() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        window.location.href = 'index.html';
    }
}

// Made with Bob
