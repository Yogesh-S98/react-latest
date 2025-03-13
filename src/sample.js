  
  function RowList({ children }) {
    return (
      <div className="RowList">
        {Children.map(children, child =>
          <div className="Row">
            {child}
          </div>
        )}
      </div>
    );
  }
  function ListDiv() {
    return (
      <RowList>
        <p>This is the first item.</p>
        <p>This is the second item.</p>
        <p>This is the third item.</p>
      </RowList>
    );
  }
  
  function TabSwitcher({ tabs }) {
    const [selecedId, setSelectedId] = useState(tabs[0].id);
    const selectedTab = tabs.find(tab => tab.id === selecedId);
    return (
      <>
        <div className='d-flex '>
            {tabs.map(tab => (
              <div className='p-2'>
                <button key={tab.id} onClick={() => setSelectedId(tab.id)}>{tab.header}</button>
              </div>
            ))}
        </div>
        <hr />
        <div key={selecedId}>
          <h3>{selectedTab.header}</h3>
          { selectedTab.content }
        </div>
      </>
    )
  }
  function TabView() {
    return (
      <TabSwitcher
        tabs={[
          {
            id: 'tab1',
            header: 'Tab 1',
            content: <p>Tab 1 content</p>
          },
          {
            id: 'tab2',
            header: 'Tab 2',
            content: <p>Tab 2 content</p>
          }
        ]}
      ></TabSwitcher>
    )
  }
function Home() {
    const [openModal, setOpenModal] = useState(false);
    const getCode = () => {
      setOpenModal(true);
    }
    const logout = () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return (
      <div className="App-header">
        <Hooks></Hooks>
        <MyContext.Provider value={'Hello, World!'}>
          <div>Open List</div>
          {/* <ListDiv></ListDiv>
          <TabView></TabView> */}
          <div className='flex-center'>
            <Button onClick={getCode}>Click me</Button>
            <Button className='m-2' onClick={() => logout()}>Logout</Button>
          </div>
          <MyModal show={openModal} onClose={() => setOpenModal(false)} />
        </MyContext.Provider>
      </div>
    );
  }
  const object = {
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    skills: [''],
    avatar: ''
  }
  const ProfileAvatar = (img) => {
    return (
      <img
        className='avatar'
        src={img.src.src}
        height={img.src.size}
        width={img.src.size}
        alt={img.src.name}/>
    )
  }
  const MyModal = ({ show, onClose }) => {
    const text = useContext(MyContext);
    const [list, setList] = useState([]);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(object);
    const [errors, setErrors] = useState(object);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    
    const fetchData = async () => {
      setLoading(true);
      setAvatarUrl('');
      const result = await data();
      console.log("data", result.data);
      if (result.data) {
        setList(result.data);
        setTimeout(() => {
          setLoading(false);
        }
        , 1000);
      }
    }
    
    useEffect(() => {
      if (show) {
        fetchData();
        setFormData(object);
        setErrors(object);
      }
    }
    , [show]);
  
    if (!show) return null;
    const handleChange = (e, index) => {
      const { name, value, files } = e.target;
      if (name === 'avatar' && files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        // setFormData((prevFormData) => ({
        //   ...prevFormData,
        //   avatar: url
        // }));
        // setAvatarUrl(url);
      } else if (name === 'skills') {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData({ ...formData, skills: newSkills });
  
        const newSkillErrors = [...errors.skills];
        newSkillErrors[index] = value ? '' : 'Skill is required';
        setErrors({ ...errors, skills: newSkillErrors });
      } else {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
      }
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = {};
      if (!formData.first_name) {
        newErrors.first_name = 'Name is required';
      }
  
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
  
      if (!formData.gender) {
        newErrors.gender = 'Select gender';
      }
  
      formData.skills.forEach((skill, index) => {
        if (!skill) {
          newErrors.skills = newErrors.skills || [];
          newErrors.skills[index] = 'Skill is required';
        }
      });
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        const payload = {
          ...formData,
          avatar: avatarUrl
        };
        const send = await create(payload);
        console.log('sss', send);
        if (send) {
          setList([...list, payload]);
          setFormData(object);
          setErrors(object);
          setAvatarUrl('');
          // onClose();
        }
        // setList([...list, formData]);
        console.log('Form Data:', payload);
        // onClose();
      }
    }
    const closeModel = () => {
      onClose();
      setAvatarUrl('');
      setFormData(object);
      setErrors(object);
    }
    const openImage = (e) => {
      setProfile(e);
    }
    const listItems = list.map((item, index) => {
      return (
        <Col key={index} className='list-item justify-content-start'>
          <img
            src={item.avatar}
            alt='avatar' 
            width={50}
            height={50}
            onClick={() => openImage(item)} />
          <div className='p-2'>
            <div>Name: {item.first_name} {item.last_name}</div>
            <div>Email: {item.email}</div>
          </div>
        </Col>
      );
    });
    const addInput = () => {
      setFormData({ ...formData, skills: [...formData.skills, ''] });
      // setErrors({ ...errors, skills: [...errors.skills, 'Skill is required'] });
    };
    return (
      <div>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <p>Loading...</p>}
          {!loading && (
            <div>
            <p>{text}</p>
            <Form>
              <Form.Group controlId='first_name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  name='first_name'
                  placeholder='Enter your name'
                  value={formData.first_name}
                  isInvalid={!!errors.first_name}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  isInvalid={!!errors.email}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='avatar'>
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type='file'
                  name='avatar'
                  value={formData.avatar}
                  placeholder='Select your avatar'
                  onChange={handleChange}
                />
                {avatarUrl && (
                  <div>
                    <img src={avatarUrl} alt='Avatar' width='100' height='100' />
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='gender'>
              <Form.Label>Gender</Form.Label>
                <Form.Control
                  as='select'
                  type='select'
                  name='gender'
                  options={['name',]}
                  placeholder='Select your gender'
                  value={formData.gender}
                  isInvalid={!!errors.gender}
                  onChange={handleChange}
                >
                  <option value=''>Select your gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Form.Control>
                <Form.Control.Feedback type='invalid'>
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
              {formData.skills.map((skill, index) => (
                <Form.Group controlId={`skills_${index}`} key={index}>
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    type='text'
                    name='skills'
                    placeholder='Enter your skills'
                    value={skill}
                    isInvalid={!!errors.skills[index]}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.skills[index]}
                  </Form.Control.Feedback>
                </Form.Group>
              ))}
            <Button variant='primary' onClick={addInput}>
              + Add Skills
            </Button>
            </Form>
  
            <div>{listItems}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} variant="primary" type="submit">
            Submit
          </Button>
          <Button onClick={closeModel} variant='danger'>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={profile}>
        <Modal.Header>
          <Modal.Title>
            Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProfileAvatar src={{
              src: profile?.avatar,
              size: 200,
              name: `${profile?.first_name} ${profile?.last
                ? profile?.last_name
                : ''}`
              }
          }>
          </ProfileAvatar>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setProfile(null)} variant='danger'>Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  };