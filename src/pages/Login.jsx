// import { useState } from "react"
import { Eye, EyeOff, Plane, Shield, Globe } from "lucide-react"
import { LoginForm } from "../components/ui/LoginForm"

export default function Login() {
  // const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Login Form */}
        <div className="flex flex-col p-6 md:p-10 lg:p-12 xl:p-16">
          {/* Header */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg">
                  <Plane className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Al Saqib Travels
                </h1>
                <p className="text-sm text-muted-foreground">Global Travel Solutions</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="w-full max-w-md mx-auto">
              {/* Welcome Card */}
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground text-lg">
                  Sign in to access your travel dashboard
                </p>
              </div>

              {/* Login Form */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                <LoginForm />
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>Global Access</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-end">
                  <Plane className="h-4 w-4 text-purple-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-6 border-t border-gray-200 dark:border-gray-800">
            <p>© {new Date().getFullYear()} Al Saqib Travels. All rights reserved.</p>
            <p className="mt-1">Connecting you to the world, one journey at a time</p>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="relative hidden lg:block overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="/travels-agency-cover.png"
              alt="Travel Agency Dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-blue-900/90 mix-blend-multiply"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-between p-12 xl:p-16">
            {/* Top Content */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Access</h2>
                <p className="text-blue-100">For authorized personnel only</p>
              </div>
            </div>

            {/* Center Content */}
            <div className="max-w-lg">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                  Premium Travel Management
                </span>
                <h3 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                  Manage Global Travel Operations
                </h3>
                <p className="text-xl text-blue-100/90 leading-relaxed">
                  Access real-time bookings, manage reservations, track flights, and handle customer
                  inquiries from our comprehensive travel management dashboard.
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "✈️", text: "Flight Management" },
                  { icon: "🏨", text: "Hotel Bookings" },
                  { icon: "📊", text: "Real-time Analytics" },
                  { icon: "👥", text: "Customer CRM" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Content */}
            <div className="flex items-center justify-between">
              <div className="text-white/80">
                <p className="text-sm">Need help accessing your account?</p>
                <p className="font-medium">Contact: support@alsaqibtravels.com</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}