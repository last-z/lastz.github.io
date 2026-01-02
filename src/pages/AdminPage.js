import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminPage.css';

const AdminPage = ({ onNavigateToPlan }) => {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [selectedPlansForMerge, setSelectedPlansForMerge] = useState(new Set());
  const [mergedPlanName, setMergedPlanName] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  // eslint-disable-next-line no-unused-vars
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

  const handleDeletePlan = (id) => {
    if (window.confirm(t('admin.confirmDelete') || 'Are you sure?')) {
      setPlans(plans.filter(p => p.id !== id));
      if (editingPlan?.id === id) {
        resetForm();
        setEditingPlan(null);
      }
    }
  };

  const handleEditPlan = (plan) => {
    setFormData(plan);
    setEditingPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const importedData = JSON.parse(event.target.result);
        
        // Handle both single plan (object) and multiple plans (array)
        let plansToImport = [];
        
        if (Array.isArray(importedData)) {
          // If it's an array, use it directly
          plansToImport = importedData;
        } else if (importedData && typeof importedData === 'object' && importedData.name) {
          // If it's a single plan object with a name property, wrap it in an array
          plansToImport = [importedData];
        } else {
          throw new Error('Invalid plan format');
        }
        
        if (plansToImport.length > 0) {
          setPlans([...plans, ...plansToImport]);
          alert(t('admin.importSuccess') || `Successfully imported ${plansToImport.length} plan(s)!`);
        } else {
          alert(t('admin.importError') || 'No valid plans found in file');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(t('admin.importError') || 'Error importing plans. Make sure the file is valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSelectPlanForMerge = (planId) => {
    const newSelected = new Set(selectedPlansForMerge);
    if (newSelected.has(planId)) {
      newSelected.delete(planId);
    } else {
      newSelected.add(planId);
    }
    setSelectedPlansForMerge(newSelected);
  };

  const handleMergePlans = () => {
    if (selectedPlansForMerge.size < 2) {
      alert(t('admin.selectAtLeastTwo') || 'Please select at least 2 plans to merge');
      return;
    }

    if (!mergedPlanName.trim()) {
      alert(t('admin.mergedPlanNameRequired') || 'Please enter a name for the merged plan');
      return;
    }

    const selectedPlans = plans.filter(p => selectedPlansForMerge.has(p.id));
    
    // Merge markings from all selected plans
    const mergedMarkings = selectedPlans.reduce((acc, plan) => {
      return [...acc, ...(plan.markings || [])];
    }, []);

    // Use the first plan's spawn and take average of timings
    const mergedPlan = {
      id: Date.now(),
      name: mergedPlanName.trim(),
      description: `Merged from ${selectedPlans.length} plans: ${selectedPlans.map(p => p.name).join(', ')}`,
      teamTimings: {
        A: Math.round(selectedPlans.reduce((sum, p) => sum + (p.teamTimings?.A || 0), 0) / selectedPlans.length),
        B: Math.round(selectedPlans.reduce((sum, p) => sum + (p.teamTimings?.B || 0), 0) / selectedPlans.length),
        C: Math.round(selectedPlans.reduce((sum, p) => sum + (p.teamTimings?.C || 0), 0) / selectedPlans.length),
        D: Math.round(selectedPlans.reduce((sum, p) => sum + (p.teamTimings?.D || 0), 0) / selectedPlans.length)
      },
      teamSpawn: selectedPlans[0].teamSpawn || 'BLUE_DOWN',
      markings: mergedMarkings,
      createdAt: new Date().toISOString(),
      mergedFromPlans: selectedPlans.map(p => p.id)
    };

    setPlans([...plans, mergedPlan]);
    setSelectedPlansForMerge(new Set());
    setMergedPlanName('');
    alert(t('admin.mergeSuccess') || `Successfully merged ${selectedPlans.length} plans!`);
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
        {/* Merge Plans Section */}
        <div className="admin-form-container">
          <div className="admin-form-section">
            <h2>🔀 Merge Plans</h2>
            <p className="merge-info">Select 2 or more plans from the right panel to combine them into one</p>
            
            <div className="form-group">
              <label>Merged Plan Name *</label>
              <input
                type="text"
                value={mergedPlanName}
                onChange={(e) => setMergedPlanName(e.target.value)}
                placeholder="e.g., Combined Strategy"
                className="form-input"
              />
            </div>

            <div className="merge-info-box">
              <h3>Selected Plans: {selectedPlansForMerge.size}</h3>
              {selectedPlansForMerge.size > 0 && (
                <ul className="selected-plans-list">
                  {plans.filter(p => selectedPlansForMerge.has(p.id)).map(p => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              )}
              <p className="merge-description">
                {selectedPlansForMerge.size >= 2 
                  ? `Will combine ${selectedPlansForMerge.size} plans with averaged team timings`
                  : 'Select at least 2 plans to enable merge'}
              </p>
            </div>

            <div className="form-actions">
              <button 
                className="btn-primary"
                onClick={handleMergePlans}
                disabled={selectedPlansForMerge.size < 2 || !mergedPlanName.trim()}
              >
                🔀 Merge Selected Plans
              </button>
              {selectedPlansForMerge.size > 0 && (
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedPlansForMerge(new Set());
                    setMergedPlanName('');
                  }}
                >
                  Clear Selection
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
                  <div key={plan.id} className={`plan-card ${selectedPlansForMerge.has(plan.id) ? 'selected' : ''}`}>
                    <div className="plan-checkbox-wrapper">
                      <input
                        type="checkbox"
                        id={`plan-${plan.id}`}
                        checked={selectedPlansForMerge.has(plan.id)}
                        onChange={() => handleSelectPlanForMerge(plan.id)}
                        className="plan-checkbox"
                      />
                    </div>
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
