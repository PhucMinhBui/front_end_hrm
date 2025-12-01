import Icons from "../utils/icons";

const Sidebar = ({ currentPage, onPageChange, userRole, isOpen, toggleSidebar }) => {
    const adminMenuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: 'home' },
        { id: 'employees', name: 'Quản lý nhân viên', icon: 'users' },
        { id: 'departments', name: 'Phòng ban', icon: 'building' },
        { id: 'attendance', name: 'Chấm công', icon: 'clock' },
        { id: 'attendance-admin', name: 'Quản lý chấm công', icon: 'calendar' },
        { id: 'payroll', name: 'Bảng lương', icon: 'dollar-sign' },
        { id: 'leave', name: 'Yêu cầu', icon: 'file-text' },
        { id: 'settings', name: 'Cài đặt', icon: 'settings' }
    ];

    const employeesMenuItems = [
        { id: 'attendance', name: 'Chấm công', icon: 'clock' },
        { id: 'payroll', name: 'Thông tin lương', icon: 'dollar-sign' },
        { id: 'leave', name: 'Yêu cầu của tôi', icon: 'file-text' }
    ];

    const menuItems = userRole === "admin" ? adminMenuItems : employeesMenuItems;

    return (
        <>
            {/* Overlay mobile khi sidebar mở */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform 
                transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`}
            >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center lg:block">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            {Icons.render('users', 'w-6 h-6 text-white')}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">StuTechHR</h1>
                            <p className="text-sm text-gray-500">Quản lý nhân sự</p>
                        </div>
                    </div>

                    {/* Nút đóng sidebar mobile */}
                    <button
                        className="lg:hidden text-gray-600"
                        onClick={toggleSidebar}
                    >
                        ✖
                    </button>
                </div>

                <nav className="mt-6">
                    <div className="px-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onPageChange(item.id);
                                    toggleSidebar();
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentPage === item.id
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                            >
                                {Icons.render(item.icon, "w-5 h-5")}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
