import { MetaProvider, Title, Meta } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>MaydayLand</Title>
          <Meta name="theme-color" content="#000000" />
          <Meta name="keywords" content="五月天,5525,回到那一天" />
          <Meta name="description" content="欢迎光临「5525 回到那一天」" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
