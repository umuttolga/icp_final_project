import React from 'react'
import Card from './Utilities/Card'
import ProposalCard from './Utilities/ProposalCard'
import BgTopSvg from '../Svgs/BgTopSvg'
import BgStringSvg from '../Svgs/BgStringSvg'


const HeroSection = ({ currentProposal }) => {
    // Styles
    const containterCard = "mx-4 mt-4 p-4 h-[10rem]  md:w-[30vw] md:h-[15vw] "
    const textStyle = "text-white text-[18px] p-4 grid place-items-center gap-y-4 mt-4"
    const sectionContainer = "md:flex md:gap-x-[20vw] "
    const customCard = "w-[40vw] "
    // console.log(currentProposal)

    return (
        <div className="md:mt-10 mb-10 md:grid  md:place-items-center ">
            <div className="hidden md:flex">
                <div className="absolute  right-0 bottom-[50%] -z-30 ">
                    <BgTopSvg height={"1100"} width={"900"} />
                </div>
                <div className="absolute  -left-[20vw] bottom-[50%] -z-30 ">
                    <BgTopSvg height={"1100"} width={"1400"} />
                </div>

            </div>

            <div className={sectionContainer}>
                <div className={customCard}>
                    <ProposalCard proposal={currentProposal} />
                </div>
            </div>
        </div>
    )
}

export default HeroSection
