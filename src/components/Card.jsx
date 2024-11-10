import React, { useState, useCallback, useEffect } from 'react'
import { FaRegFileAlt, FaEdit, FaPaperclip, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5"
import { motion } from "framer-motion"

function Card({data, reference, onDelete, onEdit, onFileUpload}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedDesc, setEditedDesc] = useState(data.desc)
	const [editedTitle, setEditedTitle] = useState(data.tag.tagTitle)
	const [editedTagColor, setEditedTagColor] = useState(data.tag.tagColor)
	const [fileInputRef, setFileInputRef] = useState(null);

	useEffect(() => {
		setEditedDesc(data.desc)
		setEditedTitle(data.tag.tagTitle)
		setEditedTagColor(data.tag.tagColor)
	}, [data])

	const handleEdit = useCallback(() => {
		console.log('Editing card:', data.id)
		console.log('New data:', { 
			desc: editedDesc, 
			tag: {
				...data.tag,
				tagTitle: editedTitle,
				tagColor: editedTagColor
			}
		})
		onEdit(data.id, { 
			desc: editedDesc, 
			tag: {
				...data.tag,
				tagTitle: editedTitle,
				tagColor: editedTagColor
			}
		})
		setIsEditing(false)
	}, [data.id, editedDesc, editedTitle, editedTagColor, onEdit, data.tag])

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			onFileUpload(data.id, file);
		}
	}

	const handleDelete = () => {
		onDelete(data.id);
	}

	const handleFileUploadClick = () => {
		fileInputRef.click();
	}

	const getPriorityColor = (priority) => {
		switch(priority) {
			case 'high':
				return 'text-red-500';
			case 'medium':
				return 'text-yellow-500';
			case 'low':
				return 'text-green-500';
			default:
				return 'text-gray-500';
		}
	}

	return (
		<motion.div 
			drag 
			dragConstraints={reference} 
			whileHover={{scale: 1.05}} 
			dragElastic={0.2} 
			dragTransition={{bounceStiffness: 300, bounceDamping: 20}}
			className='relative w-60 h-72 rounded-[45px] bg-zinc-900/90 text-white px-8 py-10 overflow-hidden'
		>
			<FaRegFileAlt />
			{isEditing ? (
				<>
					<input 
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						className="mt-5 w-full bg-transparent border-b border-white"
						placeholder="Enter title"
					/>
					<textarea 
						value={editedDesc}
						onChange={(e) => setEditedDesc(e.target.value)}
						className="mt-3 w-full bg-transparent border-b border-white resize-none"
						placeholder="Enter description"
					/>
					<select
						value={editedTagColor}
						onChange={(e) => setEditedTagColor(e.target.value)}
						className="mt-2 w-full bg-zinc-800 text-white rounded p-1"
					>
						<option value="green">Green</option>
						<option value="blue">Blue</option>
						<option value="red">Red</option>
						<option value="yellow">Yellow</option>
					</select>
					<button onClick={handleEdit} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
						Save
					</button>
				</>
			) : (
				<>
					<p className='text-sm leading-tight mt-5 font-semibold'>{data.desc}</p>
				</>
			)}
			{data.file && (
				<div className="mt-2 text-xs">
					<FaPaperclip className="inline mr-1" />
					{data.file.name}
				</div>
			)}
			<div className='footer absolute bottom-0 w-full left-0'>
				<div className='flex items-center justify-between py-3 px-8 mb-3'>
					<div className='flex items-center gap-2'>
						<span className='w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center cursor-pointer' onClick={handleDelete}>
							<FaTrash size={14} />
							</span>
						<span className='w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center cursor-pointer' onClick={handleFileUploadClick}>
							<FaPaperclip size={14} />
							</span>
						<span className='w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center cursor-pointer'>
							{isEditing ? (
								<IoClose size={14} onClick={() => setIsEditing(false)} />
							) : (
								<FaEdit size={14} onClick={() => setIsEditing(true)} />
							)}
						</span>
					</div>
				</div>
				{data.tag.isOpen && (
					<div 
						className={`tag w-full py-4 ${getTagColorClass(data.tag.tagColor)} flex items-center justify-center`}
					>
						<h3 className='text-sm font-semibold'>{data.tag.tagTitle}</h3>
					</div>
				)}
			</div>
			<input 
				type="file" 
				ref={setFileInputRef}
				className="hidden" 
				onChange={handleFileUpload}
			/>
		</motion.div>
	)
}

function getTagColorClass(color) {
	switch (color) {
		case 'green':
			return 'bg-green-600';
		case 'blue':
			return 'bg-blue-600';
		case 'red':
			return 'bg-red-600';
		case 'yellow':
			return 'bg-yellow-600';
		default:
			return 'bg-gray-600';
	}
}

export default Card