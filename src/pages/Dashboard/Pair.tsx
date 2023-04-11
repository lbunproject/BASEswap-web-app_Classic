
import styled from "styled-components"
import { Link, useParams } from "react-router-dom"
import container from "components/Container"

const Wrapper = styled(container)`
  width: 100%;
  height: auto;
  position: relative;
  color: ${({ theme }) => theme.primary};

  & input {
    text-align: center;
    padding: 6px 16px 5px;
    border-radius: 8px;
    border: solid 1px ${({ theme }) => theme.primary};
  }
`

const ProvideButton = styled(Link)`
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  padding: 7px 16px 7px 16px;
  border-radius: 50px;
  border: solid 1px #ffffff;
  text-decoration: none;
  cursor: pointer;
`

const PairPage = () => {
  return (<div></div>)
}

export default PairPage
