import React, { useState, useEffect } from 'react'
import { final_project_backend } from '../../../declarations/final_project_backend'
import UserInput from './Utilities/UserInput'
import ShadowButton from './Utilities/ShadowButton'
// import InputComponent from './Utilities/InputComponent'
// import MyButton from './Utilities/MyButton'
const RoundProfileSection = ({ proposalList, text, currentProposal, proposalCount }) => {
    const [loading, setLoading] = useState(false)
    const [avoidRender, setAviodRender] = useState(false)
    const [proposal, setProposal] = useState("")

    const handleChange = (e) => {
        setProposal(e.target.value)
    }
    const handleProposeSend = async () => {
        const key = Number(proposalCount) + 1
        if (proposal !== "") {
            setLoading(true)
            await final_project_backend.create_proposal(key, { description: proposal, is_active: true })
            console.log("Proposal Sent")
            setLoading(false)
            setProposal("")
            window.location.reload()
        }
    }

    // Styles
    const textStyle = "text-white text-[18px] p-4 grid place-items-center gap-y-4 mt-4"
    const inputStyle = "grid lg:grid-flow-col md:auto-cols-1fr md:gap-x-[15em] place-items-center  items-center "
    const container = `mt-4 ${currentProposal ? "" : "h-screen"} ${proposalList.length > 1 ? "" : "h-[60vh]"} md:mt-10 relative w-full `
    return (
        <div className={container}>

            <div className="my-24 grid place-items-center mb-[12%]">
                <div className={inputStyle}>
                    <UserInput value={proposal} onChange={handleChange} />
                    <ShadowButton loading={loading} onClick={() => handleProposeSend()} />
                </div>
                <p className={textStyle}>{text}</p>
            </div>
        </div>
    )
}

export default RoundProfileSection
