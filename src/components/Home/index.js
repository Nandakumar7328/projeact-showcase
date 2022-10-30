import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    categories: categoriesList[0].id,
    projectData: [],
  }

  componentDidMount() {
    this.getWebData()
  }

  onChangeSelect = event => {
    this.setState({categories: event.target.value}, this.getWebData)
  }

  getWebData = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogress})
    const {categories} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${categories}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updateData = data.projects.map(eachData => ({
        id: eachData.id,
        imageUrl: eachData.image_url,
        name: eachData.name,
      }))
      this.setState({
        projectData: updateData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderInSuccessView = () => {
    const {projectData} = this.state

    return (
      <div className="success-container">
        <ul className="ul-container">
          {projectData.map(eachProject => (
            <li key={eachProject.id} className="li-container">
              <img
                src={eachProject.imageUrl}
                alt={eachProject.name}
                className="image"
              />
              <p className="para">{eachProject.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderInProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderInFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.getWebData} className="btn" type="button">
        Retry
      </button>
    </div>
  )

  renderHomeComponent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inprogress:
        return this.renderInProgressView()
      case apiStatusConstant.success:
        return this.renderInSuccessView()
      case apiStatusConstant.failure:
        return this.renderInFailureView()
      default:
        return null
    }
  }

  render() {
    const {categories} = this.state
    return (
      <div className="main-container">
        <Header />

        <select
          onChange={this.onChangeSelect}
          className="select-container"
          value={categories}
        >
          {categoriesList.map(eachItem => (
            <option value={eachItem.id} key={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>

        {this.renderHomeComponent()}
      </div>
    )
  }
}

export default Home
