(function(){
  var forms={
    w2:{title:'W-2 · Northwind Studio',status:'12 fields',fields:[['Employee name','Jordan Lee'],['Employer EIN','**-***4821'],['Wages, tips, other compensation','$58,420.00'],['Federal income tax withheld','$6,918.00'],['Social Security wages','$58,420.00'],['Medicare wages and tips','$58,420.00']]},
    '1099':{title:'1099-INT · Cedar Bank',status:'4 fields',fields:[['Recipient name','Jordan Lee'],['Payer TIN','**-***1098'],['Interest income','$284.16'],['Federal income tax withheld','$0.00']]},
    '1098':{title:'1098-T · Evergreen College',status:'4 fields · 2 warnings',fields:[['Student name','Jordan Lee'],['Institution TIN','**-***7714'],['Payments received','$4,800.00'],['Scholarships or grants','Needs source review',true],['Enrollment status','Confirm full-time',true]]}
  };
  var list=document.getElementById('field-list'),title=document.getElementById('form-title'),status=document.getElementById('form-status');
  function show(key){var form=forms[key];title.textContent=form.title;status.textContent=form.status;list.innerHTML='';form.fields.forEach(function(field){var row=document.createElement('div');row.className='field-row';var label=document.createElement('label');label.textContent=field[0];var value=document.createElement('div');value.className='field-value';value.textContent=field[1];var check=document.createElement('span');check.className='field-check'+(field[2]?' warn':'');check.textContent=field[2]?'!':'✓';row.append(label,value,check);list.appendChild(row)});}
  document.querySelectorAll('[data-doc]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-doc]').forEach(function(item){item.classList.remove('active')});button.classList.add('active');show(button.dataset.doc)})});
  var toast=document.getElementById('demo-toast'),timer;
  document.querySelectorAll('[data-demo-action]').forEach(function(button){button.addEventListener('click',function(){toast.textContent=button.dataset.demoAction;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(function(){toast.classList.remove('show')},3600)})});
  show('w2');
})();
