import { useHistory } from 'react-router';
import { Result, Button } from 'antd';

export default function NotFound() {
  const history = useHistory()
  const backToHome = () => {
    history.push('/')
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="您访问的页面不存在！"
      extra={<Button type="primary" onClick={backToHome}>返回首页</Button>}
    />
  )
}