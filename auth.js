document.addEventListener('DOMContentLoaded', function() {
  // Criar elementos de UI para login
  const authContainer = document.createElement('div');
  authContainer.className = 'auth-container';
  authContainer.id = 'auth-container';
  authContainer.innerHTML = `
    <div id="login-section" style="display: none;">
      <input type="text" id="username-input" placeholder="Nome de usuário">
      <button id="login-btn">Entrar</button>
    </div>
    <div id="user-info" style="display: none;">
      <span id="username-display"></span>
      <button id="logout-btn">Sair</button>
    </div>
  `;
  document.body.insertBefore(authContainer, document.body.lastChild);
  
  const loginSection = document.getElementById('login-section');
  const userInfo = document.getElementById('user-info');
  const usernameInput = document.getElementById('username-input');
  const usernameDisplay = document.getElementById('username-display');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Verificar se o usuário já está logado
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Verificar se o usuário tem um nome definido
      db.ref('users/' + user.uid).once('value', (snapshot) => {
        const userData = snapshot.val() || {};
        
        if (userData.displayName) {
          // Usuário já tem nome
          showLoggedInUI(userData.displayName);
        } else {
          // Usuário autenticado mas sem nome
          showLoginUI();
        }
      });
    } else {
      // Usuário não está autenticado, fazer login anônimo
      auth.signInAnonymously()
        .then(() => {
          showLoginUI();
        })
        .catch((error) => {
          console.error('Erro ao fazer login anônimo:', error);
        });
    }
  });
  
  // Função para mostrar interface de login
  function showLoginUI() {
    loginSection.style.display = 'block';
    userInfo.style.display = 'none';
  }
  
  // Função para mostrar interface de usuário logado
  function showLoggedInUI(displayName) {
    loginSection.style.display = 'none';
    userInfo.style.display = 'block';
    usernameDisplay.textContent = `Olá, ${displayName}`;
  }
  
  // Botão de login
  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
      // Salvar o nome de usuário
      if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).update({
          displayName: username
        }).then(() => {
          showLoggedInUI(username);
        }).catch((error) => {
          console.error('Erro ao salvar nome de usuário:', error);
        });
      }
    } else {
      alert('Por favor, insira um nome de usuário válido.');
    }
  });
  
  // Botão de logout
  logoutBtn.addEventListener('click', () => {
    if (auth.currentUser) {
      // Remover dados de presença
      db.ref('presence/' + auth.currentUser.uid).remove();
      db.ref('activeUsers/' + auth.currentUser.uid).remove();
      
      // Atualizar status online
      db.ref('users/' + auth.currentUser.uid).update({
        online: false,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        // Limpar o nome de usuário
        db.ref('users/' + auth.currentUser.uid).update({
          displayName: null
        });
        
        // Fazer login anônimo novamente
        auth.signInAnonymously()
          .then(() => {
            usernameInput.value = '';
            showLoginUI();
          })
          .catch((error) => {
            console.error('Erro ao fazer login anônimo após logout:', error);
          });
      });
    }
  });
}); 