import React, { useRef, useReducer, useCallback, useState, useEffect } from 'react'
import Card from './Card'
import AddCardForm from './AddCardForm'
import Popup from './Popup'
import { FaPlus, FaUndo, FaRedo } from 'react-icons/fa'

// Define action types
const ADD_CARD = 'ADD_CARD'
const DELETE_CARD = 'DELETE_CARD'
const EDIT_CARD = 'EDIT_CARD'
const UNDO = 'UNDO'
const REDO = 'REDO'

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case ADD_CARD:
      return {
        past: [...state.past, state.present],
        present: [...state.present, action.card],
        future: []
      }
    case DELETE_CARD:
      return {
        past: [...state.past, state.present],
        present: state.present.filter(card => card.id !== action.id),
        future: []
      }
    case EDIT_CARD:
      return {
        past: [...state.past, state.present],
        present: state.present.map(card => 
          card.id === action.id ? { ...card, ...action.updates } : card
        ),
        future: []
      }
    case UNDO:
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future]
      }
    case REDO:
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1)
      }
    default:
      return state
  }
}

function Foreground() {
    const ref = useRef(null)
    const [state, dispatch] = useReducer(reducer, {
        past: [],
        present: [
            {id: 1, desc: "Example text 1", close: false, tag:{isOpen: true, tagTitle: "Card 1", tagColor: "green"}, file: null},
            {id: 2, desc: "Hello Sunshine, hope you're doing good", close: false, tag:{isOpen: true, tagTitle: "Card 2", tagColor: "blue"}, file: null},
            {id: 3, desc: "Example text 3", close: false, tag:{isOpen: true, tagTitle: "Card 3", tagColor: "green"}, file: null}
        ],
        future: []
    })
    const [showPopup, setShowPopup] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [isButtonExpanded, setIsButtonExpanded] = useState(false)

    const addCard = useCallback((newCard) => {
        dispatch({ type: ADD_CARD, card: { ...newCard, id: Date.now(), file: null } })
        setShowAddForm(false)
    }, [])

    const deleteCard = useCallback((id) => {
        dispatch({ type: DELETE_CARD, id })
    }, [])

    const editCard = useCallback((id, updatedCard) => {
        console.log('Editing card in Foreground:', id, updatedCard)
        dispatch({ 
            type: EDIT_CARD, 
            id, 
            updates: updatedCard
        })
    }, [])

    const handleFileUpload = useCallback((id, file) => {
        dispatch({ 
            type: EDIT_CARD, 
            id, 
            updates: { file, filesize: `${(file.size / 1024 / 1024).toFixed(2)}MB` } 
        })
        setShowPopup(true)
    }, [])

    const undo = useCallback(() => {
        dispatch({ type: UNDO })
    }, [])

    const redo = useCallback(() => {
        dispatch({ type: REDO })
    }, [])

    const handleMouseMove = useCallback((event) => {
        const button = document.getElementById('addButton')
        if (button) {
            const rect = button.getBoundingClientRect()
            const distance = Math.sqrt(
                Math.pow(event.clientX - (rect.left + rect.width / 2), 2) +
                Math.pow(event.clientY - (rect.top + rect.height / 2), 2)
            )
            setIsButtonExpanded(distance < 100) // Adjust this value to change the proximity threshold
        }
    }, [])

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showPopup])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [handleMouseMove])

    return (
        <>
            <div ref={ref} className='fixed z-[3] w-full h-full flex gap-5 flex-wrap p-5'>
                {state.present.map((item) => (
                    <Card 
                        key={item.id} 
                        data={item} 
                        reference={ref}
                        onDelete={deleteCard}
                        onEdit={editCard}
                        onFileUpload={handleFileUpload}
                    />
                ))}
            </div>
            <button 
                id="addButton"
                onClick={() => setShowAddForm(true)} 
                className={`fixed top-5 right-5 z-[4] bg-blue-500 text-white h-12 rounded-full flex items-center justify-center shadow-lg ${isButtonExpanded ? 'w-24' : 'w-12'}`}
            >
                {isButtonExpanded ? (
                    <span>Upload</span>
                ) : (
                    <FaPlus />
                )}
            </button>
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[5]">
                    <div className="bg-zinc-800 p-5 rounded-lg">
                        <AddCardForm onAdd={addCard} onClose={() => setShowAddForm(false)} />
                    </div>
                </div>
            )}
            <Popup message="File uploaded successfully!" isVisible={showPopup} />
        </>
    )
}

export default Foreground