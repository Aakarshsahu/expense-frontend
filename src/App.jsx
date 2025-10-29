import React, { useEffect, useState } from 'react'
import api from "./Api.js";
import SummaryChart from './SummaryChart';



function ExpenseForm({ onSaved, editing, setEditing }) {
    const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' })

    useEffect(() => {
        if (editing) setForm({
            title: editing.title || '',
            amount: editing.amount || '',
            category: editing.category || '',
            date: editing.date ? editing.date.slice(0, 10) : ''
        })
    }, [editing])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!form.title || !form.amount || !form.category || !form.date) {
            alert('Please fill all fields')
            return
        }

        try {
            if (editing && editing._id) {
                const res = await api.put(`/${editing._id}`, { ...form, amount: Number(form.amount) })
                onSaved(res.data)
                setEditing(null)
            } else {
                const res = await api.post('/', { ...form, amount: Number(form.amount) })
                onSaved(res.data)
            }
            setForm({ title: '', amount: '', category: '', date: '' })
        } catch (err) {
            console.error(err)
            alert(err?.response?.data?.message || 'Could not save expense')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>{editing ? 'Edit Expense' : 'Add Expense'}</h3>
            <label>Title
                <input name="title" value={form.title} onChange={handleChange} />
            </label>
            <label>Amount
                <input name="amount" type="number" value={form.amount} onChange={handleChange} />
            </label>
            <label>Category
                <input name="category" value={form.category} onChange={handleChange} />
            </label>
            <label>Date
                <input name="date" type="date" value={form.date} onChange={handleChange} />
            </label>
            <div className="row">
                <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
                {editing && <button type="button" onClick={() => setEditing(null)} className="btn">Cancel</button>}
            </div>
        </form>
    )
}

function ExpenseList({ items, onEdit, onDelete }) {
    if (!items.length) return <p>No expenses yet.</p>
    return (
        <div className="list">
            {items.map(item => (
                <div key={item._id} className="list-item">
                    <div>
                        <div className="title">{item.title}</div>
                        <div className="meta">{new Date(item.date).toLocaleDateString()} • {item.category}</div>
                    </div>
                    <div className="controls">
                        <div className="amount">₹{item.amount}</div>
                        <button className="btn small" onClick={() => onEdit(item)}>Edit</button>
                        <button className="btn small danger" onClick={() => onDelete(item._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

// New Summary component
function Summary({ summary, loading }) {
    return (
        <div className="card">
            <h3>Summary</h3>
            {loading ? <p>Loading summary...</p> : (
                <>
                    <p><strong>Total expenses:</strong> <span className="total-value">₹{summary.total ?? 0}</span></p>
                    <p><strong>Entries:</strong> {summary.count ?? 0}</p>

                    <h4 style={{ marginTop: 12 }}>By Category</h4>
                    {(!summary.byCategory || summary.byCategory.length === 0) ? (
                        <p>No categories yet.</p>
                    ) : (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {summary.byCategory.map(c => (
                                <li key={c.category}>
                                    {c.category}: ₹{c.total} ({c.count})
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    )
}



export default function App() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(null)

    // summary states
    const [summary, setSummary] = useState({ total: 0, count: 0, byCategory: [] })
    const [summaryLoading, setSummaryLoading] = useState(true)

    useEffect(() => {
        // load both list and summary on mount
        fetchAll()
        fetchSummary()
    }, [])

    async function fetchAll() {
        try {
            setLoading(true)
            const res = await api.get('/')
            setExpenses(res.data)
        } catch (err) {
            console.error(err)
            alert('Could not fetch expenses')
        } finally {
            setLoading(false)
        }
    }

    async function fetchSummary() {
        try {
            setSummaryLoading(true)
            const res = await api.get('/summary') // calls /api/expenses/summary
            setSummary(res.data)
        } catch (err) {
            console.error('Could not fetch summary', err)
            setSummary({ total: 0, count: 0, byCategory: [] })
        } finally {
            setSummaryLoading(false)
        }
    }

    function handleSaved(item) {
        // if exists update else prepend
        setExpenses(prev => {
            const exists = prev.find(p => p._id === item._id)
            if (exists) return prev.map(p => p._id === item._id ? item : p)
            return [item, ...prev]
        })

        // refresh summary after save
        fetchSummary()
    }

    async function handleDelete(id) {
        if (!confirm('Delete this expense?')) return
        try {
            await api.delete(`/${id}`)
            setExpenses(prev => prev.filter(p => p._id !== id))
            // refresh summary after delete
            fetchSummary()
        } catch (err) {
            console.error(err)
            alert('Could not delete')
        }
    }

    return (
        <div className="container">
            <h1 className="heading">EXPENSE TRACKER</h1>
            <div className="grid">
                <div className="col">
                    <ExpenseForm onSaved={handleSaved} editing={editing} setEditing={setEditing} />
                    
                </div>
                <div className="col">
                    <div className="card">
                        <Summary summary={summary} loading={summaryLoading} />
                        
                        <h3 style={{ marginTop: 12 }}>Expenses</h3>
                        {loading ? <p>Loading...</p> : <ExpenseList items={expenses} onEdit={setEditing} onDelete={handleDelete} />}
                    </div>
                </div>
            </div>
            <SummaryChart summary={summary} loading={summaryLoading} />
        </div>
    )
}
