import type React from "react"

interface MinimalLayoutProps extends React.PropsWithChildren {}

function MinimalLayout({ children }: MinimalLayoutProps) {
  return (
    <>
      <h2>This is minial layout</h2>
      <main>{children}</main>
    </>
  )
}

export default MinimalLayout