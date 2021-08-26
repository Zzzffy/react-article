import { BackTop } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'
export default function BackToTop() {
  const styleToTop: any = {
    height: 60,
    width: 60,
    lineHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: '1px solid #f1f1f1',
    borderRadius: '50%',
    boxShadow: '0 0 5px rgb(0 0 0 / 5 %)',
    cursor: 'pointer',
    fontSize: '22px'
  };

  return (
    <>
    <BackTop visibilityHeight={240} >
      <div style={styleToTop}><ArrowUpOutlined /></div>
    </BackTop>
    </>
  )
}
