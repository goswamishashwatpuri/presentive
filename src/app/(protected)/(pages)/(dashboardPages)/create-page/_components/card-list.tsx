'use client'

import React, { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OutlineCard } from '@/lib/types'
import OutlineDisplayCard from './outline-display-card'
import AddCardButton from './add-card-button'

type Props = {
  outlines: OutlineCard[]
  editingCard: string | null
  selectedCard: string | null
  editText: string
  addOutline?: (card: OutlineCard) => void
  onEditChange: (value: string) => void
  onCardSelect: (id: string) => void
  onCardDoubleClick: (id: string, title: string) => void
  setEditText: (text: string) => void
  setEditingCard: (id: string | null) => void
  setSelectedCard: (id: string | null) => void
  addMultipleOutlines: (cards: OutlineCard[]) => void
}

function CardList({
  outlines,
  editingCard,
  selectedCard,
  editText,
  onEditChange,
  onCardSelect,
  onCardDoubleClick,
  setEditText,
  setEditingCard,
  setSelectedCard,
  addMultipleOutlines,
}: Props) {

  const [draggedItem, setDraggedItem] = useState<OutlineCard | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dataOffsetY = useRef(0)

  function onDragOverHandler(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (!draggedItem) return
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const threshold = rect.height / 2

    if (y < threshold) {
      setDragOverIndex(index)
    } else {
      setDragOverIndex(index + 1)
    }
  }

  function onAddCard(index?: number) {
    const newCard: OutlineCard = {
      id: Math.random().toString(36).substring(2, 9),
      title: editText || "New Section",
      order: (index !== undefined ? index + 1 : outlines.length) + 1
    }
    const updatedCards = index !== undefined ?
      [
        ...outlines.slice(0, index + 1),
        newCard,
        ...outlines
          .slice(index + 1)
          .map((card) => ({ ...card, order: card.order + 1 }))
      ] :
      [...outlines, newCard]

    addMultipleOutlines(updatedCards)
    setEditText('')
  }

  function onDropHandler() {
    if (!draggedItem || dragOverIndex === null) return

    const updatedCards = [...outlines]
    const draggedIndex = updatedCards.findIndex(
      (card) => card.id === draggedItem.id
    )

    if (draggedIndex === -1 || draggedIndex === dragOverIndex) return
    const [removedCard] = updatedCards.splice(draggedIndex, 1)

    updatedCards.splice(
      dragOverIndex > draggedIndex ? dragOverIndex - 1 : dragOverIndex,
      0,
      removedCard
    )
    addMultipleOutlines(
      updatedCards.map((card, index) => ({ ...card, order: index + 1 }))
    )
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  function onCardUpdate(id: string, newTitle: string) {
    addMultipleOutlines(outlines
      .map((card) =>
        card.id == id ? { ...card, title: newTitle } : card
      )
    )
    setEditingCard(null)
    setSelectedCard(null)
    setEditText('')
  }

  function onCardDelete(id: string) {
    addMultipleOutlines(outlines
      .filter((card) => card.id !== id)
      .map((card, index) => ({ ...card, order: index + 1 }))
    )
  }

  function getDragOverStyles(index: number) {
    if (dragOverIndex === null || draggedItem === null) return {}
    if (index === dragOverIndex)
      return {
        borderTop: '2px solid #000',
        marginTop: '0.5rem',
        transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }
    else if (index === dragOverIndex - 1 || index === dragOverIndex + 1)
      return {
        borderBottom: '2px solid #000',
        marginBottom: '0.5rem',
        transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }

    return {}
  }

  function onDragStartHandler(e: React.DragEvent, card: OutlineCard) {
    setDraggedItem(card)
    e.dataTransfer.effectAllowed = 'move'

    const rect = e.currentTarget.getBoundingClientRect()
    dataOffsetY.current = e.clientY - rect.top
    const draggedElement = e.currentTarget.cloneNode(true) as HTMLElement
    draggedElement.style.position = 'absolute'
    draggedElement.style.top = `-1000px`
    draggedElement.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`
    document.body.appendChild(draggedElement)
    e.dataTransfer.setDragImage(draggedElement, 0, dataOffsetY.current)

    setTimeout(() => {
      setDragOverIndex(outlines.findIndex((c) => c.id === card.id))
      document.body.removeChild(draggedElement)
    }, 0)
  }

  function onDragEndHandler() {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  return (

    <motion.div
      className='space-y-2 -my-2'
      layout
      onDragOver={(e) => {
        if (outlines.length === 0 ||
          e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20) {
          onDragOverHandler(e, outlines.length)
        }
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDropHandler()
      }}
    >
      <AnimatePresence>
        {outlines.map((card, index) => {
          return (
            <React.Fragment key={card.id}>
              <OutlineDisplayCard
                onDragOver={(e) => onDragOverHandler(e, index)}
                card={card}
                isEditing={editingCard === card.id}
                isSelected={selectedCard === card.id}
                editText={editText}
                onEditChange={onEditChange}
                onEditBlur={() => onCardUpdate(card.id, editText)}
                onEditKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onCardUpdate(card.id, editText)
                  }
                }}
                onCardClick={() => onCardSelect(card.id)}
                onCardDoubleClick={() => onCardDoubleClick(card.id, card.title)}
                onDeleteClick={() => onCardDelete(card.id)}
                dragHandlers={{
                  onDragStart: (e) => onDragStartHandler(e, card),
                  onDragEnd: onDragEndHandler
                }}
                dragOverStyles={getDragOverStyles(index)}
              />
              <AddCardButton
                onAddCard={() => onAddCard(index)}
              />
            </React.Fragment>
          )
        })}
      </AnimatePresence>
    </motion.div>

  )
}

export default CardList