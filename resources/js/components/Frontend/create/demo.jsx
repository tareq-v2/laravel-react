import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaRedo, FaCloudUploadAlt, FaTimes, FaClock } from 'react-icons/fa';
import VirtualKeyboard from '../Frontend/VirtualKeyboard';
import AuthModal from '../Frontend/AuthModal';
import '../Frontend/BusinessCreateForm.css';
import Preview from './Preview';
import FeatureSelection from './FeatureSelection';

const BusinessCreateForm = ({ 
    isEditMode = false, 
    initialData = null,
    onSubmit: externalSubmit,
    onCancel 
}) => {
    // ... existing state declarations ...

    // Days for working hours
    const daysOfWeek = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    // ... existing useEffect hooks ...

    // Initialize form data with working hours fields
    const [formData, setFormData] = useState({
        businessName: '',
        address: '',
        // ... other fields ...
        // Working hours fields
        monday: false,
        monday_startTime: '',
        monday_endTime: '',
        tuesday: false,
        tuesday_startTime: '',
        tuesday_endTime: '',
        wednesday: false,
        wednesday_startTime: '',
        wednesday_endTime: '',
        thursday: false,
        thursday_startTime: '',
        thursday_endTime: '',
        friday: false,
        friday_startTime: '',
        friday_endTime: '',
        saturday: false,
        saturday_startTime: '',
        saturday_endTime: '',
        sunday: false,
        sunday_startTime: '',
        sunday_endTime: '',
        hide_hour: false,
        // ... other fields ...
    });

    // ... existing functions ...

    // Handle day checkbox change
    const handleDayCheckboxChange = (dayId, checked) => {
        setFormData(prev => ({
            ...prev,
            [dayId]: checked,
            // Clear times when unchecking
            [`${dayId}_startTime`]: checked ? prev[`${dayId}_startTime`] : '',
            [`${dayId}_endTime`]: checked ? prev[`${dayId}_endTime`] : ''
        }));
    };

    // Handle time input change
    const handleTimeChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle hide hours checkbox
    const handleHideHoursChange = (e) => {
        const checked = e.target.checked;
        if (checked) {
            // Reset all day fields when hiding hours
            const resetFields = {};
            daysOfWeek.forEach(day => {
                resetFields[day.id] = false;
                resetFields[`${day.id}_startTime`] = '';
                resetFields[`${day.id}_endTime`] = '';
            });
            
            setFormData(prev => ({
                ...prev,
                ...resetFields,
                hide_hour: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                hide_hour: checked
            }));
        }
    };

    return (
        <section className="sptb pt-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-10" style={{ position: 'relative' }}>
                        {/* ... existing conditional rendering for preview/feature selection ... */}
                        
                        {!showFeatureSelection && !showPreview && (
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* ... other form sections ... */}
                                
                                {/* Working Hours Section - Updated */}
                                <div className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3">Working Hours</h5>
                                    
                                    <div className="form-group">
                                        <label className="form-label text-dark fw-semibold">
                                            Working Hours Summary
                                        </label>
                                        <input
                                            type="text"
                                            name="workingHour"
                                            value={formData.workingHour}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                                        />
                                    </div>
                                    
                                    <div className="form-group mt-3">
                                        <label className="form-label mb-0">
                                            <span style={{ fontSize: '12pt' }}>Hide</span>
                                            <input
                                                type="checkbox"
                                                id="hideHours"
                                                name="hide_hour"
                                                checked={formData.hide_hour}
                                                onChange={handleHideHoursChange}
                                                className="ms-2 me-2"
                                            />
                                            <span className="text-muted font-weight-semibold" style={{ fontSize: '14px' }}>
                                                (Check the box if you prefer not to display the operating hours)
                                            </span>
                                        </label>
                                    </div>
                                    
                                    {!formData.hide_hour && (
                                        <div className="container px-0 mt-3" style={{ marginTop: '6px' }}>
                                            <div className="card p-2 mb-1 hour_card">
                                                <div className="m-0 p-0">
                                                    {daysOfWeek.map(day => (
                                                        <div className="row mb-2 align-items-center" key={day.id}>
                                                            <div className="col-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id={day.id}
                                                                    name={day.id}
                                                                    checked={formData[day.id]}
                                                                    onChange={(e) => handleDayCheckboxChange(day.id, e.target.checked)}
                                                                    className="me-2"
                                                                />
                                                                <label htmlFor={day.id} className="font-weight-bold">
                                                                    {day.label}
                                                                </label>
                                                            </div>
                                                            <div className="col-9 px-0">
                                                                <div className="row m-0 p-0">
                                                                    <div className="col-6">
                                                                        <div className="input-group">
                                                                            <label className="input-group-text">From</label>
                                                                            <input
                                                                                type="time"
                                                                                name={`${day.id}_startTime`}
                                                                                value={formData[`${day.id}_startTime`]}
                                                                                onChange={(e) => handleTimeChange(`${day.id}_startTime`, e.target.value)}
                                                                                className="form-control"
                                                                                disabled={!formData[day.id]}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <div className="input-group">
                                                                            <label className="input-group-text">To</label>
                                                                            <input
                                                                                type="time"
                                                                                name={`${day.id}_endTime`}
                                                                                value={formData[`${day.id}_endTime`]}
                                                                                onChange={(e) => handleTimeChange(`${day.id}_endTime`, e.target.value)}
                                                                                className="form-control"
                                                                                disabled={!formData[day.id]}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* ... rest of the form ... */}
                            </form>
                        )}
                    </div>
                </div>
            </div>
            
            {/* ... existing modals and components ... */}
        </section>
    );
};

export default BusinessCreateForm;