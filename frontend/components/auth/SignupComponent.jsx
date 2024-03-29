import {useState} from "react";
import {preSignup} from "../../actions/auth";

const SignupComponent = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: null,
    loading: false,
    message: null,
    showForm: true
  });

  const onChangeHandler = (e) => {
    setState({
      ...state,
      error: null,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      loading: true
    });
    try {
      const userData = {
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirm: state.passwordConfirm
      }
      // Enviar email con información para activar la cuenta
      const response = await preSignup(userData);
      
      setState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        message: response.data.message,
        error: null,
        loading: false,
        showForm: false
      });
    } catch (error) {
      // Procesar error de límite de solicitudes excedido
      if(error.response && error.response.status === 429) {
        return setState({
          ...state,
          message: null,
          error: error.response.data.message,
          loading: false,
          showForm: true
        });
      };
      
      if(error.response && error.response.data) {
        return setState({
          ...state,
          loading: false,
          showForm: true,
          error: {...error.response.data}
        })
      };
      
      setState({
        ...state,
        loading: false,
        showForm: true,
        error: error.message
      })
    }
  }

  const showError = () => {
  return state.error ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-danger"
    >
      <button
        style={{position: "absolute", top: 0, right: "5px"}}
        type="button"
        class="close"
        onClick={() => setState({...state, error: null})}
        aria-label="Close"
      >
        <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
      </button>
      {state.error.error || state.error}
    </div>
    : null
  }

  const showMessage = () => {
  return state.message ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      <button
        style={{position: "absolute", top: 0, right: "5px"}}
        type="button"
        class="close"
        onClick={() => setState({...state, message: null})}
        aria-label="Close"
      >
        <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
      </button>
      {state.message}
    </div>
    : null
  }

  return (
    <React.Fragment>
      {showMessage()}
      {showError()}
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Nombre"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.name}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.email}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Contraseña"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="passwordConfirm"
            className="form-control"
            disabled={state.loading || !state.showForm}
            placeholder="Confirmar contraseña"
            onChange={onChangeHandler}
            value={state.passwordConfirm}
          />
        </div>
        <div>
          <button
            className="btn btn-action"
            disabled={state.loading || !state.showForm}
          >
            Registrarse
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default SignupComponent;
