import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminPage.css';

const AdminPage = ({ onNavigateToPlan }) => {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState([]);
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
    const savedPlans = localStorage.getItem('ROLsPlans');
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
    localStorage.setItem('ROLsPlans', JSON.stringify(plans));
  }, [plans]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (onNavigateToPlan) {
      onNavigateToPlan(plan);
    } else {
      // Fallback: save to localStorage and load
      localStorage.setItem('pendingPlanToLoad', JSON.stringify(plan));
      window.location.href = '/lastz.github.io';
    }
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
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-content">
          <h1>{t('admin.panelTitle') || 'ROLS Plans Administration'}</h1>
          <p className="admin-subtitle">{t('admin.manageStrategies') || 'Create, manage, and deploy battle strategies'}</p>
        </div>
        <div className="admin-page-controls">
          <select 
            value={i18n.language} 
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              localStorage.setItem('language', e.target.value);
            }}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
          <a href="/lastz.github.io" className="btn-back">← Back to Planner</a>
        </div>
      </div>

      <div className="admin-page-container">
        {/* Form Section */}
        <div className="admin-form-container">
          <div className="admin-form-section">
            <h2>{editingPlan ? t('admin.editPlan') : t('admin.createNewPlan') || 'Create New Plan'}</h2>
            
            <div className="form-group">
              <label>{t('admin.planName') || 'Plan Name'}*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('admin.planNamePlaceholder') || 'e.g., Attack Strategy A'}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>{t('admin.description') || 'Description'}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('admin.descriptionPlaceholder') || 'Plan details, tactics, notes...'}
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>{t('admin.teamSpawn') || 'Team Spawn'}</label>
              <select
                name="teamSpawn"
                value={formData.teamSpawn}
                onChange={handleInputChange}
                className="form-select"
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
                      className="form-input-small"
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
        </div>

        {/* Plans List Section */}
        <div className="admin-list-container">
          <div className="admin-list-section">
            <div className="list-header">
              <h2>{t('admin.savedPlans') || 'Saved Plans'} ({plans.length})</h2>
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
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p className="empty-message">{t('admin.noPlansSaved') || 'No plans saved yet'}</p>
                <p className="empty-submessage">Create your first plan using the form on the left</p>
              </div>
            ) : (
              <div className="plans-list">
                {plans.map(plan => (
                  <div key={plan.id} className="plan-card">
                    <div className="plan-info">
                      <h3>{plan.name}</h3>
                      {plan.description && <p>{plan.description}</p>}
                      <div className="plan-meta">
                        <span className="plan-spawn">
                          {plan.teamSpawn === 'BLUE_DOWN' ? '🔵 Blue' : '🔴 Red'}
                        </span>
                        <span className="plan-date">
                          {plan.createdAt && new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
  );
};

export default AdminPage;
