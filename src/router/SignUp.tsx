import axios, { AxiosError } from 'axios';
import { User, signupAPI } from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Main = styled.main`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.section`
  width: 590px;
  padding: 50px 50px;
  border-radius: 12px;
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 10);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  width: 100%;
  margin-bottom: 20px;
  color: #1f2937;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  width: 100%;
  margin-bottom: 8px;
  color: #a6b3be;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 54px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  position: relative;
`;

const InputIcon = styled.img`
  position: absolute;
  left: 16px;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  padding-left: 48px;
  border-radius: 4px;
  border: 1px solid var(--input-stroke, #d2dbe2);
  &::placeholder {
    font-size: 14px;
  }
`;

const Submit = styled.input`
  width: 100%;
  height: 56px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.1) 100%
    ),
    #d2d2d2;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DEFAULT_ERROR_MESSAGE = {
  userId: '',
  password: '',
  email: '',
  username: '',
};

export default function SignUp() {
  const [signupForm, setSignupForm] = useState<User>({
    userId: '',
    password: '',
    email: '',
    username: '',
    sex: 'MAN',
    nickname: '',
    city: '',
    district: '',
    roadAddress: '',
  });
  const [errorMessage, setErrorMessage] = useState<Omit<User, 'sex'>>({
    userId: '',
    password: '',
    email: '',
    username: '',
    nickname: '',
    city: '',
    district: '',
    roadAddress: '',
  });

  const navigate = useNavigate();

  const onchangeSexRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSex = e.target.value as 'MAN' | 'WOMAN';
    setSignupForm({ ...signupForm, sex: selectedSex });
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const isValidatePass = validateSignUpForm();
    if (!isValidatePass) return false;

    try {
      await axios.post('/signup', { ...signupForm });
      window.alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.message === 'UserId is duplicated')
          return setErrorMessage({
            ...errorMessage,
            userId: '입력된 아이디는 이미 가입된 상태입니다.',
          });
      }
      console.error('네트워크 에러');
    }
  };

  const validateSignUpForm = () => {
    const passwordRegExp = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}/;
    const emailRegExp = /[a-z0-9]+@[a-z0-9]+.[a-z]{3,4}/;

    const { userId, password, email, username } = signupForm;
    let signupErrorMessage = { ...DEFAULT_ERROR_MESSAGE };

    if (userId.length <= 7 || userId.length >= 17)
      signupErrorMessage = {
        ...signupErrorMessage,
        userId: '아이디는 8자 이상 ~ 16자 이하의 길이를 입력해야 합니다.',
      };
    if (!password.match(passwordRegExp))
      signupErrorMessage = {
        ...signupErrorMessage,
        password: '비밀번호가 정규식에 해당하지 않습니다.',
      };
    if (password.length <= 7 || password.length >= 17)
      signupErrorMessage = {
        ...signupErrorMessage,
        password: '비밀번호는 8자 이상 ~ 16자 이하의 길이를 입력해야 합니다.',
      };
    if (!email.match(emailRegExp))
      signupErrorMessage = {
        ...signupErrorMessage,
        email: '이메일이 정규식을 통과하지 못했습니다.',
      };
    if (!username) {
      signupErrorMessage = {
        ...signupErrorMessage,
        username: '이름은 필수 입력 요소입니다.',
      };
    }
    if (
      Object.entries(DEFAULT_ERROR_MESSAGE).toString() !==
      Object.entries(signupErrorMessage).toString()
    ) {
      setErrorMessage({ ...signupErrorMessage });
      return false;
    }
    setErrorMessage({ ...DEFAULT_ERROR_MESSAGE });
    return true;
  };

  if ('test'.length === 3)
    return (
      <>
        <header>
          <h1>Hinc</h1>
        </header>
        <main role="signup">
          <section>
            <article>
              <form>
                <div>
                  <input
                    type="text"
                    value={signupForm.userId}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, userId: e.target.value })
                    }
                    placeholder="아이디"
                  />
                  <button>중복 검사</button>
                </div>
                <span>{errorMessage.userId}</span>

                <div>
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                    placeholder="비밀번호"
                  />
                  <p>눈 아이콘</p>
                </div>
                <span>{errorMessage.password}</span>

                <div>
                  <label htmlFor="email">이메일</label>
                  <div>
                    <input
                      type="text"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      placeholder="이메일"
                    />
                    <button role="email-auth">전송</button>
                  </div>
                </div>
                <span>{errorMessage.email}</span>

                <input
                  type="text"
                  value={signupForm.username}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, username: e.target.value })
                  }
                  placeholder="이름"
                />
                <span>{errorMessage.username}</span>

                <input
                  type="text"
                  value={signupForm.nickname}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, nickname: e.target.value })
                  }
                  placeholder="닉네임"
                />
                <span>{errorMessage.nickname}</span>

                <div>
                  <label htmlFor="birth">
                    <span>생년월일</span>
                    <input id="birth" type="text" readOnly />
                  </label>
                </div>
                <div>
                  <label htmlFor="gender">성별</label>
                  <ul>
                    <li>
                      남성
                      <input
                        type="radio"
                        name="gender"
                        value="MAN"
                        checked={signupForm.sex === 'MAN'}
                        onChange={onchangeSexRadio}
                      />
                    </li>
                    <li>
                      여성
                      <input
                        type="radio"
                        name="gender"
                        value="WOMAN"
                        checked={signupForm.sex === 'WOMAN'}
                        onChange={onchangeSexRadio}
                      />
                    </li>
                  </ul>
                  <input
                    type="text"
                    value={signupForm.city}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, city: e.target.value })
                    }
                    placeholder="도시"
                  />
                  <input
                    type="text"
                    value={signupForm.district}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, district: e.target.value })
                    }
                    placeholder="구역"
                  />
                  <input
                    type="text"
                    value={signupForm.roadAddress}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        roadAddress: e.target.value,
                      })
                    }
                    placeholder="도로명 주소"
                  />
                </div>
                <p>
                  가입하기 버튼을 클릭하면 takebook의 약관, 개인정보처리방침 및
                  쿠키 정책에 동의하게 됩니다. takebook으로부터 SNS 알림을 받을
                  수 있으며 알림은 언제든지 수신 거부할 수 있습니다.
                </p>
                <input type="submit" value="가입하기" onClick={handleSignUp} />
              </form>
            </article>
          </section>
        </main>
      </>
    );
  return (
    <Main>
      <Wrapper>
        <Title>회원가입</Title>
        <Form>
          <Label>{`이메일[필수]`}</Label>
          <InputWrapper>
            <InputIcon src="./assets/mail-01.svg" />
            <Input type="text" placeholder="이메일을 입력해주세요." />
          </InputWrapper>
          <Label>{`비밀번호[필수]`}</Label>
          <InputWrapper>
            <InputIcon src="./assets/lock-01.svg" />
            <Input type="password" placeholder="비밀번호를 입력해주세요" />
          </InputWrapper>
          <Label>{`이름(닉네임)[필수]`}</Label>

          <InputWrapper>
            <Input type="text" placeholder="이메일 입력" />
          </InputWrapper>
          <Submit type="submit" value="인증요청" />
        </Form>
      </Wrapper>
    </Main>
  );
}
