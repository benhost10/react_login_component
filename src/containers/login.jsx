import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Login() {
  const [show, setShow] = useState(false)
  const [getText,setGetText]=useState("")
  const [getTextP,setGetTextP]=useState("")
  const [len,setLen]=useState(false)
  const [checking,setChecking]=useState(true)
  const [checkingP,setCheckingP]=useState(true)
  const [name, setName]=useState("")
  const [chekingName, setCheckingName]=useState(true)
  const [nameError, setNameError]=useState("")
  const [email, setEmail] = useState("")
  const [chekingEmail, setCheckingEmail]=useState(true)
  const [emailError, setEmailError]=useState("")
  const [password, setPassword] = useState("")
  const [checkingPassword, setCheckingPassword]=useState(true)
  const [passwordError, setPasswordError]=useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [checkingConfirmPassword, setCheckingConfirmPassword]=useState(true)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Regex pour les validations
  const nameRegex = /^(?=.*\d).+$/  // Doit contenir au moins un chiffre
  const emailRegex = /^(?=.*\d)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/  // Email valide avec au moins un chiffre
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/  // Au moins une lettre et un chiffre, 6+ caractères

  const handleChange = (e) => {
    setGetText(e.target.value)
    if (e.target.value.trim() !== "") {
      setChecking(true)
    }
  }

  const passChange = (e) => {
    setGetTextP(e.target.value)
    if (e.target.value.trim() !== "" && e.target.value.length > 6) {
      setCheckingP(true)
      setLen(false)
    } else if (e.target.value.length > 0 && e.target.value.length <= 6) {
      setCheckingP(false)
      setLen(true)
    }
  }

  const sending = async (e) => {
    e.preventDefault()

    let hasError = false

    if (getText.trim() === "") {
      setChecking(false)
      hasError = true
    } else {
      setChecking(true)
    }

    if (getTextP.trim() === "" || getTextP.length <= 6) {
      setCheckingP(false)
      setLen(true)
      hasError = true
    } else {
      setCheckingP(true)
      setLen(false)
    }

    if (hasError) return

    console.log("Formulaire valide ! Connexion en cours...")

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch(
        "https://api.react.nos-apps.com/api/groupe-4/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: getText,
            password: getTextP,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion")
      }

      console.log("Connexion réussie :", data)

      setMessage("Connexion réussie 🎉")

    } catch (error) {
      console.error("Erreur login :", error)
      setMessage("Échec de la connexion : " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterName=(e)=>{
    const value = e.target.value
    setName(value)
    
    if (value.trim() === "") {
      setCheckingName(false)
      setNameError("Le nom est requis")
    } else if (!nameRegex.test(value)) {
      setCheckingName(false)
      setNameError("Le nom doit contenir au moins un chiffre")
    } else {
      setCheckingName(true)
      setNameError("")
    }
  }

  const handleRegisterEmail=(e)=>{
    const value = e.target.value
    setEmail(value)
    
    if (value.trim() === "") {
      setCheckingEmail(false)
      setEmailError("L'email est requis")
    } else if (!emailRegex.test(value)) {
      setCheckingEmail(false)
      setEmailError("L'email doit être valide et contenir au moins un chiffre")
    } else {
      setCheckingEmail(true)
      setEmailError("")
    }
  }

  const handlePassWord=(e)=>{
    const value = e.target.value
    setPassword(value)
    
    if (value.trim() === "") {
      setCheckingPassword(false)
      setPasswordError("Le mot de passe est requis")
    } else if (!passwordRegex.test(value)) {
      setCheckingPassword(false)
      setPasswordError("Le mot de passe doit contenir des lettres et des chiffres (min 6 caractères)")
    } else {
      setCheckingPassword(true)
      setPasswordError("")
    }
    
    // Vérifier si les mots de passe correspondent
    if(confirmPassword !== "" && value !== confirmPassword) {
      setPasswordMatch(false)
    } else if(confirmPassword !== "" && value === confirmPassword) {
      setPasswordMatch(true)
    }
  }

  const handleConfirmPassword=(e)=>{
    const value = e.target.value
    setConfirmPassword(value)
    
    if(value.trim() === "") {
      setCheckingConfirmPassword(false)
    } else if (!passwordRegex.test(value)) {
      setCheckingConfirmPassword(false)
    } else {
      setCheckingConfirmPassword(true)
    }
    
    // Vérifier si les mots de passe correspondent
    if(value !== password) {
      setPasswordMatch(false)
    } else {
      setPasswordMatch(true)
    }
  }

  const sendingRegister = async (e) => {
    e.preventDefault()
    
    let hasError = false
    
    // Validation du nom
    if (name.trim() === "") {
      setCheckingName(false)
      setNameError("Le nom est requis")
      hasError = true
    } else if (!nameRegex.test(name)) {
      setCheckingName(false)
      setNameError("Le nom doit contenir au moins un chiffre")
      hasError = true
    }
    
    // Validation de l'email
    if (email.trim() === "") {
      setCheckingEmail(false)
      setEmailError("L'email est requis")
      hasError = true
    } else if (!emailRegex.test(email)) {
      setCheckingEmail(false)
      setEmailError("L'email doit être valide et contenir au moins un chiffre")
      hasError = true
    }
    
    // Validation du mot de passe
    if (password.trim() === "") {
      setCheckingPassword(false)
      setPasswordError("Le mot de passe est requis")
      hasError = true
    } else if (!passwordRegex.test(password)) {
      setCheckingPassword(false)
      setPasswordError("Le mot de passe doit contenir des lettres et des chiffres (min 6 caractères)")
      hasError = true
    }
    
    // Validation de la confirmation du mot de passe
    if (confirmPassword.trim() === "") {
      setCheckingConfirmPassword(false)
      hasError = true
    } else if (!passwordRegex.test(confirmPassword)) {
      setCheckingConfirmPassword(false)
      hasError = true
    }
    
    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      setPasswordMatch(false)
      hasError = true
    }
    
    if (hasError) {
      setMessage("Veuillez corriger les erreurs dans le formulaire")
      return
    }
    
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await fetch("https://api.react.nos-apps.com/api/groupe-4/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription")
      }
      
      setMessage(`Inscription réussie ! Bienvenue ${name}`)
      console.log("Réponse API :", data)
      
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setNameError("")
      setEmailError("")
      setPasswordError("")
      
      setTimeout(() => {
        setShow(false)
        setMessage("")
      }, 2000)
      
    } catch (error) {
      setMessage("Échec de l'inscription : " + error.message)
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl md:bg-amber-50 md:h-150 overflow-hidden shadow-2xl">
        
        <div className={`${show ? "transform transition-all duration-600 translate-x-full opacity-0 flex flex-col justify-center items-center ":
          " h-full w-full md:rounded-r-[100px] p-6 bg-blue-950 flex flex-col justify-center items-center"}`}>
            <div className="hidden md:grid gap-2.5">
              <p className="text-white text-3xl">hello, Welcome</p>
              <p className="text-white px-3">don't have an account ?</p>
              <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={()=>setShow(true)}>register</button>
            </div>

          <div className="w-full max-w-sm md:hidden">
            <label htmlFor="email">
              <p className="text-white">email:</p>
              <input type="email" className={`${checking ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
            "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"}`}name="email" placeholder="xxx@gmail.com" 
              onChange={handleChange}/>
            </label>
            <label htmlFor="password">
              <p className="text-white">password:</p>
              <input type="password" className={`${checkingP ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
              "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"}`} name="password" placeholder="password"
              onChange={passChange}/>
            </label>
            <div className={`${len ? "text-lg text-red-500":"hidden"}`}>le mot de passe est trop faible</div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-full mt-4 w-full hover:bg-blue-600" onClick={sending}>connexion</button>
          </div>
          <button 
            className="md:hidden underline px-6 py-2 mt-4 text-white"
            onClick={() => setShow(true)}>create an account</button>
        </div>

        <div className={`${show ? "transform transition-all duration-100.5 -translate-x-full hidden":
          "hidden md:grid bg-transparent gap-10 p-10 items-center"}`}>
          <div className="grid gap-2.5">
            <label htmlFor="email" className="text-2xl"><p>email:</p></label>
            <input type="email" className={`${checking ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-pulse":
            "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-pulse"}`}name="email" placeholder="xxx@gmail.com" 
              onChange={handleChange}/>
            <label htmlFor="password" className="text-2xl"><p>password</p></label>
            <input type="password" className={`${checkingP ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-pulse":
              "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-pulse"}`} name="password" placeholder="password"
              onChange={passChange}/>
            <div className={`${len ? "text-xl text-red-500":"hidden"}`}>le mot de passe est trop faible</div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" onClick={sending}>login</button>
          </div>
        </div>

        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-105%" }}
              transition={{ duration: 0.5, ease: "easeIn", type:"spring", stiffness:60 }}
              className="hidden md:flex md:bg-transparent md:h-full w-full rounded-box p-6 justify-center items-center flex-2">
              
              <div className="w-full max-w-sm">
                {message && (
                  <div className={`p-4 mb-4 rounded-lg text-center ${message.includes('réussie') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                  </div>
                )}
                
                <label htmlFor="name">
                  <p className="text-2xl">name:</p>
                  <input 
                    type="text" 
                    className={`${chekingName ? "w-full px-4 py-2 text-lg border-2 border-blue-500 rounded placeholder:animate-bounce":
                      "w-full px-4 py-2 text-lg border-2 border-red-600 rounded placeholder:animate-bounce"} `} 
                    placeholder="enter a name" 
                    name="name"
                    value={name}
                    onChange={handleRegisterName}/>
                  {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </label>
                
                <label htmlFor="email">
                  <p className="text-2xl">email:</p>
                  <input type="email"
                   className={`${chekingEmail ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
                    "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"} `} 
                   placeholder="xxx@gmail.com"
                   value={email}
                   onChange={handleRegisterEmail}/>
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </label>
                
                <label htmlFor="password">
                  <p className="text-2xl">password:</p>
                  <input type="password" 
                  name="password"
                  className={`${checkingPassword ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
                    "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"} `}
                  placeholder="password"
                  value={password}
                  onChange={handlePassWord}/>
                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </label>

                <label htmlFor="confirm_password">
                  <p className="text-2xl">confirm password:</p>
                  <input type="password" 
                  name="confirm_password"
                  className={`${checkingConfirmPassword && passwordMatch ? "w-full px-4 py-2 border-2 border-blue-500 rounded":
                    "w-full px-4 py-2 border-2 border-red-600 rounded"} `}
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}/>
                  {!passwordMatch && <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>}
                </label>
                
                <button 
                  className="w-full px-6 py-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600 disabled:bg-gray-400" 
                  onClick={sendingRegister}
                  disabled={isLoading}>
                  {isLoading ? "Loading..." : "sign up"}
                </button>
              </div>

              <div className="text-2xl text-white absolute top-0 w-full h-full bg-blue-950 left-[105%] text-center 
              flex flex-col justify-center items-center rounded-l-[100px] gap-3">
                <div className="text-3xl text-white">Wish you a good continuation</div>
                <div>already have an account ?</div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={()=>setShow(!show)}>Login</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -160 }}
              transition={{ duration: 0.5, ease: "easeInOut", type:"spring", stiffness:60 }}
              className="flex md:hidden h-[120%] w-full rounded-box p-6 justify-center items-center bg-blue-950">
              
              <div className="w-full max-w-sm">
                {message && (
                  <div className={`p-3 mb-4 rounded-lg text-center text-sm ${message.includes('réussie') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name">
                    <p className="text-white">name:</p>
                    <input 
                      type="text" 
                      className={`${chekingName ? "w-full px-4 py-2 text-lg border-2 border-blue-500 rounded placeholder:animate-bounce":
                        "w-full px-4 py-2 text-lg border-2 border-red-600 rounded placeholder:animate-bounce"} `} 
                      placeholder="enter a name" 
                      name="name"
                      value={name}
                      onChange={handleRegisterName}/>
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </label>
                  
                  <label htmlFor="email" className="text-white">enter your email</label>
                  <input type="email" 
                   className={`${chekingEmail ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
                      "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"} `} 
                   placeholder="xxx@gmail.com"
                   value={email}
                   onChange={handleRegisterEmail}/>
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                  <label htmlFor="password">
                    <p className="text-white">password:</p>
                    <input type="password" 
                    name="password"
                    className={`${checkingPassword ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
                      "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"} `}
                    placeholder="password"
                    value={password}
                    onChange={handlePassWord}/>
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                  </label>

                  <label htmlFor="confirm_password">
                    <p className="text-white">confirm password:</p>
                    <input type="password" 
                    name="confirm_password"
                    className={`${checkingConfirmPassword && passwordMatch ? "w-full px-4 py-2 border-2 border-blue-500 rounded placeholder:animate-bounce":
                      "w-full px-4 py-2 border-2 border-red-600 rounded placeholder:animate-bounce"} `}
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}/>
                    {!passwordMatch && <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>}
                  </label>
                  
                  <button 
                    className="w-full px-6 py-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600 disabled:bg-gray-400" 
                    onClick={sendingRegister}
                    disabled={isLoading}>
                    {isLoading ? "Loading..." : "sign up"}
                  </button>
                </div>
                
                <div className="translate-y-full text-center text-white">already have an account ?</div>
                <button className="w-32 inset-0 m-auto grid px-6 py-2 bg-blue-600 text-white rounded translate-y-7 hover:bg-blue-700" 
                  onClick={()=>setShow(false)}>login</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}