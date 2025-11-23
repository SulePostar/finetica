import React from "react";

export default function Users() {
    return (
        <div className="w-full px-2 py-6 max-w-full">
            <div className="w-full max-w-none">
                <h1 className="text-3xl font-semibold mb-6">User Management Dashboard</h1>

                <div className="flex items-center gap-3 mb-6 w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                    />

                    <select className="p-2 border border-gray-300 rounded-md">
                        <option>All Roles</option>
                    </select>

                    <button className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition">
                        Clear Filters
                    </button>
                </div>

                <div className="border rounded-lg overflow-hidden w-full">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Last Active</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-t">
                                <td className="p-4">Temp User</td>
                                <td className="p-4">temp@example.com</td>
                                <td className="p-4">Temp Role</td>
                                <td className="p-4">Pending</td>
                                <td className="p-4">--</td>
                                <td className="p-4">...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
