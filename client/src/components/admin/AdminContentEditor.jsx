/**
 * AdminContentEditor — View layer for Feature 20 (FAQ CRUD)
 * Owner: Miskatul Afrin Anika
 * Controller: adminController.createFAQ(), updateFAQ(), deleteFAQ()
 * Model: FAQ.js
 *
 * SRS Requirements:
 * FR-20.3: Allow admins to create, edit, and delete FAQ entries
 * FR-20.4: Each FAQ has question, answer, category, display order, active/inactive flag
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../community/FAQ.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['Eligibility', 'Blood Types', 'Preparation', 'After Donation'];

const emptyForm = { question: '', answer: '', category: 'Eligibility', order: 0, isActive: true };

const AdminContentEditor = () => {
    const { token } = useAuth();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    const fetchFAQs = async () => {
        try {
            const res = await axios.get(`${API_URL}/community/faqs`);
            setFaqs(res.data);
        } catch (err) {
            console.error('Failed to load FAQs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFAQs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.question.trim() || !form.answer.trim()) {
            setError('Question and answer are required');
            return;
        }

        try {
            if (editingId) {
                await axios.put(`${API_URL}/admin/faqs/${editingId}`, form, { headers });
                setSuccess('FAQ updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/faqs`, form, { headers });
                setSuccess('FAQ created successfully');
            }
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            fetchFAQs();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save FAQ');
        }
    };

    const handleEdit = (faq) => {
        setForm({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order || 0,
            isActive: faq.isActive
        });
        setEditingId(faq._id);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this FAQ?')) return;
        try {
            await axios.delete(`${API_URL}/admin/faqs/${id}`, { headers });
            setSuccess('FAQ deleted');
            fetchFAQs();
        } catch (err) {
            setError('Failed to delete FAQ');
        }
    };

    const handleCancel = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    if (loading) return <div className="loading-screen">Loading FAQs...</div>;

    return (
        <div className="faq-page">
            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">📝 FAQ Management</h1>
                    <p className="faq-subtitle">Create, edit, and manage FAQ entries</p>
                </div>

                {/* Add New Button */}
                {!showForm && (
                    <button
                        className="admin-add-btn"
                        onClick={() => { setShowForm(true); setForm(emptyForm); setEditingId(null); }}
                    >
                        + Add New FAQ
                    </button>
                )}

                {/* Messages */}
                {error && <p className="feedback-error" style={{ marginBottom: '1rem' }}>{error}</p>}
                {success && <p style={{ color: '#4caf50', fontSize: '0.85rem', marginBottom: '1rem' }}>{success}</p>}

                {/* FAQ Form */}
                {showForm && (
                    <form className="admin-faq-form" onSubmit={handleSubmit}>
                        <h3 className="admin-form-title">
                            {editingId ? 'Edit FAQ' : 'New FAQ'}
                        </h3>

                        <div className="admin-field">
                            <label>Question</label>
                            <input
                                type="text"
                                value={form.question}
                                onChange={(e) => setForm({ ...form, question: e.target.value })}
                                placeholder="Enter the question..."
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-field">
                            <label>Answer</label>
                            <textarea
                                value={form.answer}
                                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                                placeholder="Enter the answer..."
                                className="admin-textarea"
                                rows={4}
                            />
                        </div>

                        <div className="admin-row">
                            <div className="admin-field">
                                <label>Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="admin-select"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-field">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="admin-input"
                                    min="0"
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    />
                                    <span>Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="admin-actions">
                            <button type="submit" className="feedback-submit-btn" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
                                {editingId ? 'Update FAQ' : 'Create FAQ'}
                            </button>
                            <button type="button" className="admin-cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* FAQ List */}
                <div className="admin-faq-list">
                    {faqs.length === 0 ? (
                        <p className="faq-empty">No FAQs created yet. Click "Add New FAQ" to get started.</p>
                    ) : (
                        faqs.map(faq => (
                            <div key={faq._id} className={`admin-faq-item ${!faq.isActive ? 'inactive' : ''}`}>
                                <div className="admin-faq-content">
                                    <div className="admin-faq-meta">
                                        <span className="admin-faq-category">{faq.category}</span>
                                        {!faq.isActive && <span className="admin-faq-inactive">Inactive</span>}
                                    </div>
                                    <h4 className="admin-faq-question">{faq.question}</h4>
                                    <p className="admin-faq-answer">{faq.answer}</p>
                                </div>
                                <div className="admin-faq-actions">
                                    <button className="admin-edit-btn" onClick={() => handleEdit(faq)}>✏️</button>
                                    <button className="admin-delete-btn" onClick={() => handleDelete(faq._id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContentEditor;
