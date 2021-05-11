import './sidebar.css'

function Sidebar() {
  return (
    <div className='sidebar flex-grow-1'>
      <ul className='list-unstyled menu-elements'>
        <li className='active'>
          <a href='#/' className='scroll-link'>
            <i className='fas fa-home'></i>
            Home
          </a>
        </li>
        <li>
          <a href='#/' className='scroll-link'>
            <i className='fas fa-home'></i>
            Home
          </a>
        </li>
        <li>
          <a href='#/' className='scroll-link'>
            <i className='fas fa-home'></i>
            Home
          </a>
        </li>
        <li>
          <a href='#/' className='scroll-link'>
            <i className='fas fa-home'></i>
            Home
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
