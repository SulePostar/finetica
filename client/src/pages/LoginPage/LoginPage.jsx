import LoginForm from './../../components/Login/LoginForm'
import logo from './../../assets/images/Symphony_transparent_1.png'

const LoginPage = () => {
    return (
        <div
            className="min-vh-100 d-flex"
            style={{
                background: 'linear-gradient(to right, #dbd9e3ff, #a294ebff)',
            }}
        >
            <div
                className="text-white d-none d-md-flex flex-column justify-content-up align-items-start p-5"
                style={{ flex: 0.9, backgroundColor: '#8367deff' }}
            >


                <img
                    src={logo}
                    alt="Symphony Logo"
                    style={{
                        width: '500px',
                        maxWidth: '500%',
                        marginBottom: '6rem',
                    }}
                />

                <h1 className="fw-bold">Finetica</h1>
                <p className="mt-2">Welcome to Symphony's Finetica!</p>
            </div>

            {/* Right Form */}
            <div
                className="bg-white d-flex align-items-center justify-content-center p-5"
                style={{ flex: 1.6 }}
            >
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage
