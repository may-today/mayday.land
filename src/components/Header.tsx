import type { ParentComponent } from 'solid-js'

const Header: ParentComponent = (props) => {
  return (
    <p class="px-4 pt-2 pb-1">
      <span>欢迎光临 </span>
      <span class="ansi-red">5525 回到那一天</span>
      { props.children }
    </p>
  )
}

export default Header
