import { faBell, faHome, faPlayCircle } from "@fortawesome/free-regular-svg-icons"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import profiles from "./footerImages/man.jpg"

function Footer(){

    return(
        <div>
            <div className="fixed bottom-0 bg-blue-300 w-full h-15 flex gap-10 flex-wrap z-1 p-3 shadow-3xl ">
                <div className="btn btn-ghost btn-circle flex-1">
                    <FontAwesomeIcon icon={faHome}  />
                    <p>home</p>
                </div>
                <div className="btn btn-ghost btn-circle flex-1">
                    <FontAwesomeIcon icon={faPlayCircle}/>
                    <p>video</p>
                </div>
                <div className="btn btn-ghost btn-circle flex-1">
                    <FontAwesomeIcon icon={faUsers}/>
                    <p>frieds</p>
                </div>
                <div className="btn btn-ghost btn-circle flex-1">
                    <FontAwesomeIcon icon={faBell}/>
                    <p>notification</p>
                </div>
                <div className="btn btn-ghost btn-circle flex-1">
                    <img src={profiles} alt="" className=" h-10 w-10 rounded-full object-cover"/>
                </div>
            </div>
        </div>
    )
}

export default Footer