// React
import { useState,useEffect } from 'react';
// amplify auth
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
// amplify ui
import { HeaderComponent,BoardComponent } from './ui-components'
// amplify datastore
import { DataStore} from 'aws-amplify';
import { Board,Person } from './models';
// css
import './App.css';
import '@aws-amplify/ui-react/styles.css';

const content3 = <p>タブ3のコンテンツ</p>
const content4 = <p>タブ4のコンテンツ</p>

const func1 = (setContent1) => {
  DataStore.query(Board).then(values=>{
    const data = values.map(item => {
      return (
        <BoardComponent board={item} key={item.id}/>
      );
    });
    setContent1(
      <div>{ data }</div>
    );
  });
}
const func2 = (setContent2,fmsg,femail,setFmsg,setFemail,setContent1) => {
  const onEmailChange = (event) => {
    console.log(event.target.value);
    const v = event.target.value;
    setFemail(v);
  }
  const onMsgChange = (event) => {
    const v = event.target.value;
    setFmsg(v);
  }
  const onClick = () => {
    console.log("取得開始");
    DataStore.query(Person, ob => ob.email('eq',femail))
      .then(value=>{
        if(value.length !== 1){
          alert("アカウントが見つかりませんでした。");
          return;
        }
        const BoardObj = {
          message: fmsg,
          name: value[0].name,
          PersonId:value[0].id
        }
        const bd = new Board(BoardObj);
        DataStore.save(bd).then(() => {
          alert("メッセージを投稿しました。");
          func1(setContent1);
        });
      });
  }
  setContent2(
    <div>
      <h3>Create new Board:</h3>
      <div className="alert alert-primary my-3">
        <div className="mb-2">
          <label htmlFor="add_message" className="col-form-label">
            Message
          </label>
          <input type="text" className="form-control" name="" id="add-message" onChange={onMsgChange} />
        </div>
        <div className="mb-2">
          <label htmlFor="add_email" className="col-form-label">
            email
          </label>
          <input type="text" className="form-control" name="" id="add-email" onChange={onEmailChange} />
        </div>
        <div className="mb-2 text-center">
          <button className="btn btn-primary" onClick={onClick}>
            Click
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  
  /*
    content1
  */
    const [content1,setContent1] = useState("");
    useEffect(() => {
      func1(setContent1);
    },[]);
  
  /*
    conten2
  */
    const [content2,setContent2] = useState("");
    const[fmsg,setFmsg] = useState("");
    const[femail,setFemail] = useState("");
    useEffect(() => {
      func2(setContent2,fmsg,femail,setFmsg,setFemail,setContent1);
    },[fmsg,femail]);

  return (
    <div className="my-4">
      <HeaderComponent className="my-4" />
      <p>これはUIコンポーネントを利用した表示です。</p>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a href="#tab1" className="nav-link active" data-bs-toggle="tab">List</a> 
        </li>
        <li className="nav-item">
          <a href="#tab2" className="nav-link" data-bs-toggle="tab">Create</a> 
        </li>
        <li className="nav-item">
          <a href="#tab3" className="nav-link" data-bs-toggle="tab">Update</a>
        </li>
        <li className="nav-item">
          <a href="#tab4" className="nav-link" data-bs-toggle="tab">Delete</a> 
        </li>
      </ul>
      <div className="tab-content">
        <div id="tab1" className="my-2 tab-pane active">
          { content1 }
        </div>
        <div id="tab2" className="my-2 tab-pane">
          { content2 }
        </div>
        <div id="tab3" className="my-2 tab-pane">
          { content3 }
        </div>
        <div id="tab4" className="my-2 tab-pane">
          { content4 }
        </div>
      </div>
      <p className="my-2">
        <a href="." className="btn btn-primary" onClick={Auth.signOut}>Sign Out</a>
      </p>
    </div>
  );
}
export default withAuthenticator(App);
