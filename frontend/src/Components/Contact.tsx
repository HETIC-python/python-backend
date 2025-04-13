export default function Contact() {
    return (
        <div className="flex flex-col items-center p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">M-Motors</h1>
            
            <div className="w-full space-y-4">
                <div className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <h2 className="font-semibold text-xl mb-2 text-blue-600">Address</h2>
                    <p className="text-gray-700">3 rue du web</p>
                    <p className="text-gray-700">75015 PARIS</p>
                </div>

                <div className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <h2 className="font-semibold text-xl mb-2 text-blue-600">Phone</h2>
                    <p className="text-gray-700">06 01 91 42 97</p>
                </div>

                <div className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <h2 className="font-semibold text-xl mb-2 text-blue-600">Business Hours</h2>
                    <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Saturday - Sunday: Closed</p>
                </div>
            </div>
        </div>
    )
}
