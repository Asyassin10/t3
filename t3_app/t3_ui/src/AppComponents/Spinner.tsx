function Spinner() {
    return (
        <div
            aria-label="Loading..."
            role="status"
            className="flex  items-center space-x-2"
        >
            
                
               

            <img className="h-10 w-10 animate-spin stroke-gray-500" src="https://cdn-icons-png.flaticon.com/512/3305/3305803.png" alt="" />
            <span className="text-2xl font-medium text-gray-500">
            Loading...
            </span>
        </div>
    )
}

export default Spinner
