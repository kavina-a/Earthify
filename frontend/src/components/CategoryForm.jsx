
const CategoryForm = ({value, setValue, handleSubmit, buttonText = 'Submit', handleDelete}) => {
  return (

    <div>

        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
            <input type="text" className="border border-gray-300 p-2" 
            value={value} onChange={(e) => setValue(e.target.value)} placeholder='Wrtie Category Name' />
        
            <div className="flex justify-between">
                <button>{buttonText}</button>

                {handleDelete && (
                    <button onClick={handleDelete}>
                        Delete
                    </button>
                )}
            </div>
        </form>
        
      
    </div>
  )
}

export default CategoryForm
