// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'
import { MD, LG, XL, REGULAR } from '$shared/utils/styled'
import TOCSection from './TOCSection'
import TOCNav, { Link } from './TOCNav'
import BusLine, { useBusLine } from '$shared/components/BusLine'

type Props = {
    title?: string,
    children: ?Node,
    className?: string,
}

const SectionWrapper = styled.div`
    > div {
        padding-top: 72px;
    }

    > div + div {
        padding-top: 88px;
    }
`

const Wing = styled.div`
    display: none;

    @media (min-width: ${LG}px) {
        display: block;
    }
`

export const Title = styled.h1`
    color: #323232;
    display: none;
    font-size: 24px;
    font-weight: ${REGULAR};
    letter-spacing: 0;
    line-height: 1.5rem;
    margin: 0;

    @media (min-width: ${MD}px) {
        font-size: 18px;
    }

    @media (min-width: ${LG}px) {
        display: block;
        font-size: 36px;
    }
`

const UnstyledTOCPage = ({ children, title, ...props }: Props) => {
    const { stop } = useBusLine()

    return (
        <div {...props}>
            <div>
                {!!title && (
                    <React.Fragment>
                        <Wing />
                        <Title>{title}</Title>
                        <div />
                    </React.Fragment>
                )}
                <Wing>
                    <TOCNav>
                        {React.Children.map(children, (child) => (
                            child && child.type === TOCSection ? (
                                <Link
                                    active={stop === child.props.id}
                                    href={`#${child.props.id}`}
                                >
                                    {child.props.linkTitle || child.props.title}
                                </Link>
                            ) : null
                        ))}
                    </TOCNav>
                </Wing>
                <SectionWrapper>
                    {children}
                </SectionWrapper>
                <Wing />
            </div>
        </div>
    )
}

const StyledTOCPage = styled(UnstyledTOCPage)`
    margin: 0 auto;
    max-width: 624px;
    padding: 48px 32px 10rem;

    @media (min-width: ${MD}px) {
        padding: 48px 0 5rem;
        width: 896px;
    }

    @media (min-width: ${LG}px) {
        max-width: none;
        padding: 88px 0 128px;
        width: 928px;

        > div {
            display: grid;
            grid-column-gap: 64px;
            grid-template-columns: 160px 608px 160px;
        }
    }

    @media (min-width: ${XL}px) {
        width: 1132px;

        > div {
            grid-template-columns: 192px 748px 192px;
        }
    }
`

const TOCPage = (props: any) => (
    <BusLine dynamicScrollPosition>
        <StyledTOCPage {...props} />
    </BusLine>
)

TOCPage.Section = TOCSection

export default TOCPage
