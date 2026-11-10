'use strict';
// Demonstração isolada: dados 100% fictícios, somente na memória desta aba.
const mock = {
  inspections: [
    {id:'demo-001',date:'2026-11-04',unit:'Unidade Demonstrativa',sector:'Almoxarifado',inspector:'Técnico Exemplo',criticality:'Média',status:'Em andamento',observations:'Inspeção ilustrativa.'},
    {id:'demo-002',date:'2026-11-03',unit:'Unidade Demonstrativa',sector:'Produção',inspector:'Profissional Fictício',criticality:'Baixa',status:'Concluída',observations:'Dados de exemplo.'},
    {id:'demo-003',date:'2026-11-02',unit:'Unidade Modelo',sector:'Expedição',inspector:'Técnico Exemplo',criticality:'Alta',status:'Aguardando revisão',observations:'Cenário simulado.'}
  ],
  epis: [{id:'epi-1',name:'Capacete de segurança',quantity:30},{id:'epi-2',name:'Óculos de proteção',quantity:20},{id:'epi-3',name:'Luva de proteção',quantity:40}],
  deliveries: [{id:'ent-1',worker:'Colaborador Fictício',epiName:'Capacete de segurança',quantity:1}],
  users: [{name:'Técnico Exemplo',role:'Técnico de Segurança'},{name:'Profissional Fictício',role:'Consulta'}]
};
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=message=>{const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>t.classList.remove('show'),2500)};
const uid=()=>globalThis.crypto?.randomUUID?.()||'demo-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const showPage=page=>{document.querySelectorAll('.page').forEach(n=>n.classList.toggle('hidden',n.id!=='page-'+page));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===page));$('pageTitle').textContent=({dashboard:'Visão geral',inspections:'Inspeções',epis:'Gestão de EPIs',users:'Equipe fictícia',about:'Sobre o projeto'})[page];refresh()};
document.querySelectorAll('[data-page],[data-goto]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page||b.dataset.goto)));
function renderInspections(){
  $('inspectionRows').innerHTML=mock.inspections.map(i=>'<tr><td>'+escapeHTML(i.date)+'</td><td><strong>'+escapeHTML(i.unit)+'</strong><br><small>'+escapeHTML(i.sector)+'</small></td><td>'+escapeHTML(i.inspector)+'</td><td><span class="tag '+(i.criticality==='Alta'||i.criticality==='Crítica'?'high':i.criticality==='Baixa'?'low':'medium')+'">'+escapeHTML(i.criticality)+'</span></td><td>'+escapeHTML(i.status)+'</td><td><button class="outline" data-edit="'+escapeHTML(i.id)+'">Editar</button></td></tr>').join('')||'<tr><td colspan="6">Nenhuma inspeção.</td></tr>';
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openInspection(mock.inspections.find(i=>i.id===b.dataset.edit))));
  $('recentList').innerHTML=mock.inspections.slice(0,4).map(i=>'<div class="status-row"><span>'+escapeHTML(i.unit)+' · '+escapeHTML(i.sector)+'</span><small>'+escapeHTML(i.status)+'</small></div>').join('');
}
function openInspection(item){$('inspectionForm').reset();$('inspectionId').value=item?.id||'';$('unit').value=item?.unit||'';$('sector').value=item?.sector||'';$('inspector').value=item?.inspector||'';$('inspectionDate').value=item?.date||today();$('criticality').value=item?.criticality||'Média';$('inspectionStatus').value=item?.status||'Em andamento';$('observations').value=item?.observations||'';$('inspectionFormTitle').textContent=item?'Editar exemplo':'Nova inspeção';$('inspectionFormWrap').classList.remove('hidden');$('inspectionFormWrap').scrollIntoView({behavior:'smooth'})}
$('newInspection').addEventListener('click',()=>openInspection());$('cancelInspection').addEventListener('click',()=>$('inspectionFormWrap').classList.add('hidden'));
$('inspectionForm').addEventListener('submit',e=>{e.preventDefault();const item={id:$('inspectionId').value||uid(),unit:$('unit').value.trim(),sector:$('sector').value.trim(),inspector:$('inspector').value.trim(),date:$('inspectionDate').value,criticality:$('criticality').value,status:$('inspectionStatus').value,observations:$('observations').value.trim()};const index=mock.inspections.findIndex(i=>i.id===item.id);if(index>=0)mock.inspections[index]=item;else mock.inspections.unshift(item);$('inspectionFormWrap').classList.add('hidden');refresh();toast('Exemplo salvo nesta aba. Nenhum dado foi enviado.');});
function renderEpis(){
  $('epiList').innerHTML=mock.epis.map(i=>'<div class="status-row"><span>'+escapeHTML(i.name)+'</span><small>Estoque fictício: '+i.quantity+'</small></div>').join('');
  $('deliveryEpi').innerHTML=mock.epis.map(i=>'<option value="'+escapeHTML(i.id)+'">'+escapeHTML(i.name)+'</option>').join('');
  $('deliveryList').innerHTML=mock.deliveries.slice().reverse().map(i=>'<div class="status-row"><span>'+escapeHTML(i.worker)+'<br><small>'+escapeHTML(i.epiName)+'</small></span><strong>'+i.quantity+' un.</strong></div>').join('');
}
$('epiForm').addEventListener('submit',e=>{e.preventDefault();mock.epis.push({id:uid(),name:$('epiName').value.trim(),quantity:Number($('epiQty').value)});e.target.reset();refresh();toast('EPI fictício cadastrado nesta aba.');});
$('deliveryForm').addEventListener('submit',e=>{e.preventDefault();const epi=mock.epis.find(i=>i.id===$('deliveryEpi').value),qty=Number($('deliveryQty').value);if(!epi||!qty||qty<1){toast('Confira os dados da entrega.');return}mock.deliveries.push({id:uid(),worker:$('worker').value.trim(),epiName:epi.name,quantity:qty});e.target.reset();refresh();toast('Entrega demonstrativa registrada.');});
function refresh(){$('statInspections').textContent=mock.inspections.length;$('statPending').textContent=mock.inspections.filter(i=>i.status!=='Concluída').length;$('statEpis').textContent=mock.epis.length;$('statDeliveries').textContent=mock.deliveries.length;renderInspections();renderEpis();$('userList').innerHTML=mock.users.map(u=>'<div class="status-row"><strong>'+escapeHTML(u.name)+'</strong><span class="tag">'+escapeHTML(u.role)+'</span></div>').join('');}
refresh();
