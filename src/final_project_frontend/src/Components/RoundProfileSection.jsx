import React, { useState } from 'react'
import { final_project_backend } from '../../../declarations/final_project_backend'
import InputComponent from './Utilities/InputComponent'
import MyButton from './Utilities/MyButton'
const RoundProfileSection = ({ pp, text, addProposal, showProposal }) => {
    const [loading, setLoading] = useState(false)
    const [avoidRender, setAviodRender] = useState(false)
    const [proposal, setProposal] = useState("")

    const handleChange = (e) => {
        setProposal(e.target.value)
    }
    const handleProposeSend = async () => {
        setLoading(true)
        if (proposal !== "") {
            await final_project_backend.create_proposal(proposal)

        }
        window.location.reload()
        setAviodRender(true)
        addProposal(avoidRender)
        setLoading(false)
    }
    // Styles
    const textStyle = "text-white text-[18px] p-4 grid place-items-center gap-y-4 mt-4"
    const inputStyle = "flex justify-around items-center "
    const inputText = "px-5 py-2 bg-transparent outline-none w-48 text-base rounded-full shadow-inner shadow-white text-white border-2 border-white"
    const buttonStyle = " rounded-full bg-gradient-to-r  hover:bg-gradient-to-l bg-gradient-to-l from-[#3C91E6] to-[#f72585] text-white font-mono font-medium grid place-items-center flex-nowrap cursor-pointer  w-[15vw] text-[20px] p-4"
    return (
        <div className="mt-4 md:mt-10 relative w-full ">

            <div className=" ">
                <div className={inputStyle}>
                    {/* <input className={inputText} value={proposal} type="text" onChange={handleChange} /> */}
                    <InputComponent value={proposal} onChange={handleChange} />
                    <MyButton loading={loading} onClick={handleProposeSend} />
                    {/* <div onClick={handleProposeSend} className={buttonStyle}>{loading ? "Sending Proposal..." : "Add Proposal"} </div> */}
                </div>
                <p className={textStyle}>{text}</p>
            </div>
        </div>
    )
}

export default RoundProfileSection
