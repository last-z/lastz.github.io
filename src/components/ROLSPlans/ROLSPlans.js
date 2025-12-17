import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ROLSPlans.css';

const ROLSPlans = ({ onLoadPlan, onAdminToggle }) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamTimings: { A: 0, B: 0, C: 4, D: 4 },
    markings: [],
    teamSpawn: 'BLUE_DOWN'
  });

  // Load plans from localStorage on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('rolsPlans');
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error('Error loading plans:', error);
      }
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rolsPlans', JSON.stringify(plans));
  }, [plans]);

  const handleAdminToggle = () => {
    setShowAdmin(!showAdmin);
    onAdminToggle && onAdminToggle(!showAdmin);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamTimingChange = (team, value) => {
    setFormData(prev => ({
      ...prev,
      teamTimings: {
        ...prev.teamTimings,
        [team]: parseFloat(value) || 0
      }
    }));
  };

  const handleSavePlan = () => {
    if (!formData.name.trim()) {
      alert(t('admin.planNameRequired') || 'Plan name is required');
      return;
    }

    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(p => 
        p.id === editingPlan.id ? { ...formData, id: editingPlan.id } : p
      ));
      setEditingPlan(null);
    } else {
      // Create new plan
      const newPlan = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setPlans([...plans, newPlan]);
    }

    resetForm();
  };

  const handleEditPlan = (plan) => {
    setFormData(plan);
    setEditingPlan(plan);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm(t('admin.confirmDelete') || 'Are you sure?')) {
      setPlans(plans.filter(p => p.id !== id));
      if (editingPlan?.id === id) {
        resetForm();
        setEditingPlan(null);
      }
    }
  };

  const handleLoadPlan = (plan) => {
    onLoadPlan(plan);
    setShowAdmin(false);
  };

  const handleExportPlans = () => {
    const dataStr = JSON.stringify(plans, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `rols-plans-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportPlans = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedPlans = JSON.parse(event.target.result);
        if (Array.isArray(importedPlans)) {
          setPlans([...plans, ...importedPlans]);
          alert(t('admin.importSuccess') || 'Plans imported successfully!');
        }
      } catch (error) {
        alert(t('admin.importError') || 'Error importing plans');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      teamTimings: { A: 0, B: 0, C: 4, D: 4 },
      markings: [],
      teamSpawn: 'BLUE_DOWN'
    });
    setEditingPlan(null);
  };

  return (
    <div className="rols-plans-container">
      {/* ROLS Plans Button in Header */}
      <button 
        className="rols-plans-btn"
        onClick={handleAdminToggle}
        title={t('admin.panelTitle') || 'ROLS Plans'}
      >
        ⚙️ {t('admin.rolsPlans') || 'ROLS Plans'}
      </button>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <div className="admin-modal-overlay" onClick={() => setShowAdmin(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-header">
              <h2>{t('admin.panelTitle') || 'ROLS Plans Administration'}</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowAdmin(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-content">
              {/* Form Section */}
              <div className="admin-form-section">
                <h3>{editingPlan ? t('admin.editPlan') : t('admin.createNewPlan') || 'Create New Plan'}</h3>
                
                <div className="form-group">
                  <label>{t('admin.planName') || 'Plan Name'}*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('admin.planNamePlaceholder') || 'e.g., Attack Strategy A'}
                  />
                </div>

                <div className="form-group">
                  <label>{t('admin.description') || 'Description'}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t('admin.descriptionPlaceholder') || 'Plan details...'}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>{t('admin.teamSpawn') || 'Team Spawn'}</label>
                  <select
                    name="teamSpawn"
                    value={formData.teamSpawn}
                    onChange={handleInputChange}
                  >
                    <option value="BLUE_DOWN">Blue Spawn (Bottom-Right)</option>
                    <option value="RED_UP">Red Spawn (Top-Left)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('admin.teamTimings') || 'Team Attack Timings'}</label>
                  <div className="timing-inputs">
                    {['A', 'B', 'C', 'D'].map(team => (
                      <div key={team} className="timing-input">
                        <label>Team {team}</label>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={formData.teamTimings[team]}
                          onChange={(e) => handleTeamTimingChange(team, e.target.value)}
                        />
                        <span>min</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-primary"
                    onClick={handleSavePlan}
                  >
                    {editingPlan ? t('admin.updatePlan') : t('admin.savePlan') || 'Save Plan'}
                  </button>
                  {editingPlan && (
                    <button 
                      className="btn-secondary"
                      onClick={resetForm}
                    >
                      {t('admin.cancel') || 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Plans List Section */}
              <div className="admin-list-section">
                <div className="list-header">
                  <h3>{t('admin.savedPlans') || 'Saved Plans'}</h3>
                  <div className="list-actions">
                    <button 
                      className="btn-small"
                      onClick={handleExportPlans}
                      disabled={plans.length === 0}
                      title={t('admin.exportTooltip') || 'Export as JSON'}
                    >
                      📥 {t('admin.export') || 'Export'}
                    </button>
                    <label className="btn-small">
                      📤 {t('admin.import') || 'Import'}
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportPlans}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {plans.length === 0 ? (
                  <p className="empty-message">{t('admin.noPlansSaved') || 'No plans saved yet'}</p>
                ) : (
                  <div className="plans-list">
                    {plans.map(plan => (
                      <div key={plan.id} className="plan-card">
                        <div className="plan-info">
                          <h4>{plan.name}</h4>
                          {plan.description && <p>{plan.description}</p>}
                          <small>
                            {plan.createdAt && `Created: ${new Date(plan.createdAt).toLocaleDateString()}`}
                          </small>
                        </div>
                        <div className="plan-actions">
                          <button 
                            className="btn-play"
                            onClick={() => handleLoadPlan(plan)}
                            title={t('admin.playPlanTooltip') || 'Load this plan'}
                          >
                            ▶ {t('admin.play') || 'Play'}
                          </button>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditPlan(plan)}
                            title={t('admin.editTooltip') || 'Edit'}
                          >
                            ✏️ {t('admin.edit') || 'Edit'}
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeletePlan(plan.id)}
                            title={t('admin.deleteTooltip') || 'Delete'}
                          >
                            🗑 {t('admin.delete') || 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROLSPlans;
