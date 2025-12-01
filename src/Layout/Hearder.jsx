import Icons from "../utils/icons";

const Header = ({ currentPage, user, onLogout, toggleSidebar }) => {
    const pageNames = {
        dashboard: "Dashboard",
        employees: "Quản lý nhân viên",
        departments: "Phòng ban",
        attendance: "Chấm công",
        "attendance-admin": "Quản lý chấm công",
        payroll: "Bảng lương",
        leave: "Đơn nghỉ phép",
        settings: "Cài đặt",
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">

            {/* Nút mở sidebar chỉ hiện trên mobile */}
            <button
                className="lg:hidden text-gray-700 text-2xl mr-2"
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                {pageNames[currentPage] || "StuTechHR"}
            </h2>

            <div className="flex items-center space-x-4">

                <div className="relative hidden sm:block">
                    {Icons.render("bell", "w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-600")}
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                        {user?.name || "Admin"}
                    </span>

                    <button
                        onClick={onLogout}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
