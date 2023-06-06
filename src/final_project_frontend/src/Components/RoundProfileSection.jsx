import React, { useState } from 'react'
import { final_project_backend } from '../../../declarations/final_project_backend'
const RoundProfileSection = ({ pp, text }) => {
    const [loading, setLoading] = useState(false)
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
        setLoading(false)
    }
    // Styles
    const textStyle = "text-white text-[18px] p-4 grid place-items-center gap-y-4 mt-4"
    const inputStyle = "flex justify-around "
    const inputText = "w-[50vw] p-4 border-2 border-white  rounded-xl text-white bg-transparent"
    const buttonStyle = " rounded-full bg-gradient-to-r  bg-gradient-to-l from-[#3C91E6] to-[#83079C] text-white font-mono font-medium grid place-items-center flex-nowrap cursor-pointer  w-[15vw] text-[20px] p-4"
    return (
        <div className="mt-4 md:mt-10  w-full">
            <div className=" ">
                <div className={inputStyle}>
                    <input className={inputText} value={proposal} type="text" onChange={handleChange} />
                    <div onClick={handleProposeSend} className={buttonStyle}>{loading ? "Sending Proposal..." : "Add Proposal"} </div>
                </div>
                <p className={textStyle}>{text}</p>
            </div>
        </div>
    )
}

export default RoundProfileSection
