import styled from 'styled-components'

export const Divide = styled.div`
  display: flex;
  position: ${(props) => props.position || 'none'};
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  padding: ${(props) => props.padding || '0 0 0 0'};
  margin-right: ${(props) => props.marginRight || '0px'};
  flex-wrap: ${(props) => props.flexWrap || 'no-wrap'};
  width: ${(props) => props.width || 'none'};
  min-height: ${(props) => props.minHeight || 'none'};
  @media screen and (max-width: 1279px) {
    flex-direction: ${(props) =>
      props.tablet_flexDirection || props.flexDirection};
    width: ${(props) => props.tablet_width || props.width};
    justify-content: ${(props) =>
      props.tablet_justifyContent || props.justiftContent};
    align-items: ${(props) => props.tablet_alignItems || props.alignItems};
    margin-top: ${(props) => props.tablet_marginTop || props.marginTop};
    min-height: ${(props) => props.minHeight || props.minHeight};
    margin-left: ${(props) => props.tablet_marginLeft || props.marginLeft};
    margin-right: ${(props) => props.tablet_marginRight || props.marginRight};
    padding: ${(props) => props.tablet_padding || props.padding};
  }
  @media screen and (max-width: 767px) {
    flex-direction: ${(props) =>
      props.mobile_flexDirection || props.tablet_flexDirection};
    padding: ${(props) => props.mobile_padding || props.tablet_padding};
    width: ${(props) => props.mobile_width || props.tablet_width};
    justify-content: ${(props) =>
      props.mobile_justifyContent || props.tablet_justifyContent};
    align-items: ${(props) =>
      props.mobile_alignItems || props.tablet_alignItems};
    margin-top: ${(props) => props.mobile_marginTop || props.tablet_marginTop};
    margin-bottom: ${(props) =>
      props.mobile_marginBottom || props.tablet_marginBottom};
  }
`
export const Text = styled.div`
  color: ${(props) => props.color || '#f6ead6'};
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || '400'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  text-align: ${(props) => props.textAlign || 'center'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  @media screen and (max-width: 1279px) {
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    text-align: ${(props) => props.tablet_textAlign || props.textAlign};
    margin: ${(props) => props.tablet_margin || props.margin};
    top: ${(props) => props.tablet_top || props.top};
    left: ${(props) => props.tablet_left || props.left};
  }
  @media screen and (max-width: 767px) {
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
    margin: ${(props) => props.mobile_margin || props.tablet_margin};
    top: ${(props) => props.mobile_top || props.tablet_top};
    left: ${(props) => props.mobile_left || props.tablet_left};
    text-align: ${(props) => props.mobile_textAlign || props.tablet_textAlign};
  }
`
export const InfoInput = styled.input`
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '40px'};
  background-color: ${(props) => props.backgroundColor || '#f6ead6'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  padding: ${(props) => props.padding || '8px'};
  color: ${(props) => props.color || '#222322'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-bottom: ${(props) => props.borderBottom || 'none'};

  box-shadow: ${(props) => props.boxShadow || '0 0 10px rgba(0, 0, 0, 0.6)'};
  @media screen and (max-width: 1279px) {
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    width: ${(props) => props.tablet_width || props.width};
    height: ${(props) => props.tablet_height || props.height};
  }
  @media screen and (max-width: 767px) {
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
    width: ${(props) => props.mobile_width || props.tablet_width};
    height: ${(props) => props.mobile_height || props.tablet_height};
  }
`
export const SrcImage = styled.img`
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '0px'};
  object-fit: ${(props) => props.objectFit || 'cover'};
`
export const Btn = styled.button`
  color: ${(props) => props.color || '#F6EAD6'};
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '40px'};
  border-radius: ${(props) => props.borderRadius || '0'};
  border: ${(props) => props.border || '1px solid #F6EAD6'};
  padding: ${(props) => props.padding || 'none'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  right: ${(props) => props.right || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  line-height: ${(props) => props.lineHeight || 'none'};
  font-size: ${(props) => props.fontSize || '16px'};
  display: flex;
  justify-content: center;
  align-items: center;
  &:active {
    transform: translateY(0.2rem);
  }
  @media screen and (max-width: 1279px) {
    width: ${(props) => props.tablet_width || props.width};
    height: ${(props) => props.tablet_height || props.height};
    padding: ${(props) => props.tablet_padding || props.padding};
    margin: ${(props) => props.tablet_margin || props.margin};
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    left: ${(props) => props.tablet_left || props.left};
    border: ${(props) => props.tablet_border || props.border};
  }
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.tablet_width};
    height: ${(props) => props.mobile_height || props.tablet_height};
    padding: ${(props) => props.mobile_padding || props.tablet_padding};
    margin: ${(props) => props.mobile_margin || props.tablet_margin};
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
  }
`
export const FileLabel = styled.label`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  display: inline-block;
  cursor: pointer;
  color: #f6ead6;
  text-align: center;
  font-size: 20px;
  margin: 12px auto;
  background-color: rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 767px) {
    top: 15%;
    font-size: 14px;
  }
`
export const EditBtn = styled.button`
  border-radius: 0;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || '120px'};
  color: ${(props) => props.color || '#F6EAD6'};
  border: ${(props) => props.border || 'none'};
  border-radius: ${(props) => props.borderRadius || 'none'};
  padding: ${(props) => props.padding || 'none'};
  margin-top: ${(props) => props.marginTop || 'none'};
  margin-bottom: ${(props) => props.marginBottom || 'none'};
  margin-left: ${(props) => props.marginLeft || 'none'};
  opacity: 0.5;
  &:after {
    content: '';
    border-bottom: 2px solid #b99362;
    margin: auto;
    position: relative;
    top: 5px;
    width: 0%;
    display: block;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 1;
    &:after {
      width: 100%;
    }
  }
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.width};
    font-size: ${(props) => props.mobile_fontSize || props.fontSize};
    padding: ${(props) => props.mobile_padding || props.padding};
    margin-top: ${(props) => props.mobile_marginTop || props.marginTop};
    margin-bottom: ${(props) =>
      props.mobile_marginBottom || props.marginBottom};
    margin-left: ${(props) => props.mobile_marginLeft || 'none'};
  }
`
