const form = document.getElementById("tarefa-form");
const listaTarefas = document.getElementById("tarefas-lista");

let tarefaIdParaAtualizar = null; 

const carregarTarefas = async () => {
  const response = await fetch("http://localhost:9090/tarefas");
  const tarefas = await response.json();

  listaTarefas.innerHTML = ""; 

  tarefas.map((tarefa) => {
    listaTarefas.innerHTML += `
      <div class="mt-5">
        <div class="card text-center">
          <div class="card-header">
            Tarefa #${tarefa.id}
          </div>
          <div class="card-body">
            <h5 class="card-title">${tarefa.nomeResponsavel}</h5>
            <p class="card-text">${tarefa.descricao}</p> 
            <button href="#" class="btn btn-success" onclick="concluirTarefa(${tarefa.id})">Concluir</button>
            <button href="#" class="btn btn-secondary" onclick="prepararAtualizacaoTarefa(${tarefa.id})">Atualizar</button>
            <button href="#" class="btn btn-warning" onclick="cancelarTarefa(${tarefa.id})">Cancelar</button>
            <button href="#" class="btn btn-danger" onclick="deletarTarefa(${tarefa.id})">Excluir</button>
            <div id="contentSpan${tarefa.id}" class="mt-3">
              <span>Status: ${tarefa.status}</span>
              ${getIcon(tarefa.status)}
            </div>
          </div>
          <div class="card-footer text-body-secondary">
            ${tarefa.dataCriacao}
          </div>
        </div>
      </div>
    `;
  });
};

const prepararAtualizacaoTarefa = async (id) => {
  const response = await fetch(`http://localhost:9090/tarefas/${id}`);
  const tarefa = await response.json();

  document.getElementById("nomeResponsavel").value = tarefa.nomeResponsavel;
  document.getElementById("descricao").value = tarefa.descricao;
  document.getElementById("status").value = tarefa.status;

  document.getElementById("buttonModify").innerText = "Atualizar Tarefa";

  tarefaIdParaAtualizar = id;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeResponsavel = document.getElementById("nomeResponsavel").value;
  const descricao = document.getElementById("descricao").value;
  const status = document.getElementById("status").value;
  const dataCriacao = new Date().toISOString();

  if (tarefaIdParaAtualizar) {
    await fetch(`http://localhost:9090/tarefas/${tarefaIdParaAtualizar}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeResponsavel,
        descricao,
        status,
      }),
    });

    tarefaIdParaAtualizar = null;
    document.getElementById("buttonModify").innerText = "Adicionar Tarefa";
  } else {
    await fetch("http://localhost:9090/tarefas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeResponsavel,
        descricao,
        status,
        dataCriacao,
      }),
    });
  }

  carregarTarefas();
  form.reset(); 
});

const deletarTarefa = async (id) => {
  await fetch(`http://localhost:9090/tarefas/${id}`, {
    method: "DELETE",
  });
  alert("Produto deletado com sucesso!");
  location.reload();
};

const getIcon = (status) => {
  switch (status.toLowerCase()) {
    case "iniciado":
      return "<i class='bx bx-like'></i>";
    case "pendente":
      return "<i class='bx bxs-pie-chart-alt'></i>";
    case "finalizado":
      return "<i class='bx bx-check' ></i>";
    case "cancelado":
      return "<i class='bx bx-x'></i>";
    default:
      return "";
  }
};

const concluirTarefa = async (id) => {
  const dataFinalizacao = new Date().toISOString();
  const response = await fetch(`http://localhost:9090/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "finalizado", dataFinalizacao }),
  });

  const tarefaAtualizada = await response.json();
  document.querySelector(`#contentSpan${id}`).innerHTML = `
    <span>Status: ${tarefaAtualizada.status}</span>
    ${getIcon(tarefaAtualizada.status)}
  `;
};

const cancelarTarefa = async (id) => {
  const dataCancelamento = new Date().toISOString();
  const response = await fetch(`http://localhost:9090/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "cancelado",
      dataFinalizacao: dataCancelamento,
    }),
  });

  const tarefaAtualizada = await response.json();
  document.querySelector(`#contentSpan${id}`).innerHTML = `
    <span>Status: ${tarefaAtualizada.status}</span>
    ${getIcon(tarefaAtualizada.status)}
  `;
};

carregarTarefas();
