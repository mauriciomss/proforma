var TAX_RATE = parseFloat ($('#config_tax_rate').val());
var TAX_SETTING = false;
$('body').addClass('hidetax hidenote hidedate');


function getImporte(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function init_date(){
    var now = new Date();
    var month = (now.getMonth() + 1);       
    var day = now.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    //var today =  day +'-' + month + '-' + now.getFullYear().toString().substr(2,2);
    var today =  day +'-' + month + '-' + now.getFullYear();

    var intwoweeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    var month = (intwoweeks.getMonth() + 1);       
    var day = intwoweeks.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    //var twoweeks =  day +'-' + month + '-' + intwoweeks.getFullYear().toString().substr(2,2);
    var twoweeks =  day +'-' + month + '-' + intwoweeks.getFullYear();

    $('.datePicker').val(today);
    //$('.twoweeks').val(twoweeks);
}

function calculate(){

    var total_price = 0,
    total_tax = 0;

    console.log('CALCULATING - Tax Rate:'+TAX_RATE);

    $('.invoicelist-body tbody tr').each( function(){
        var row = $(this),
        rate   = row.find('.rate input').val(),
        amount = row.find('.amount input').val();

        //console.log("********"+rate+"********"+amount);

        rate = rate.replace('.','');
        rate = rate.replace('.','');
        rate = rate.replace(',','.');

        var sum = rate * amount;
        //var tax = ((sum / (TAX_RATE+100) ) * TAX_RATE);
        var tax = ( (sum * TAX_RATE) / 100 );

        total_price = total_price + sum;
        total_tax = total_tax + tax;

        //row.find('.sum').text( sum.toFixed(2) );
        row.find('.sum').text( getImporte(sum, 2, ',', '.') );
        row.find('.tax').text( tax.toFixed(2) );
        
    });

    //$('#total_price').text(total_price.toFixed(2));
    $('#total_price').text( getImporte(total_price, 2, ',', '.') );
    //$('#total_tax').text(total_tax.toFixed(2));
    $('#total_tax').text( getImporte(total_tax, 2, ',', '.') );

}


var newRow = '<tr><td><a class="control removeRow" href="#">x</a><span contenteditable>0</span></td><td><span contenteditable>Descripción</span></td><td class="amount"><input type="text" value="0"/></td><td class="rate"><input type="text" value="0" /></td><td class="tax taxrelated"></td><td class="sum"></td></tr>';

$('.invoicelist-body').on('keyup','input',function(){
    calculate();
});

$('.newRow').on('click',function(e){
    $('.invoicelist-body tbody').append(newRow);
    e.preventDefault();
    calculate();
});

$('body').on('click','.removeRow',function(e){
    $(this).closest('tr').remove();
    e.preventDefault();
    calculate();
});

$('#config_note').on('change',function(){
    $('body').toggleClass('shownote hidenote');
});
$('#config_tax').on('change',function(){
    TAX_SETTING = !TAX_SETTING;
    $('body').toggleClass('showtax hidetax');
});

$('#config_tax_rate').on('keyup',function(){
    TAX_RATE = parseFloat($(this).val());
    if (TAX_RATE < 0 || TAX_RATE > 100){
        TAX_RATE = 0;
    }
    console.log('Changed tax rate to: '+TAX_RATE);
    calculate();
});

$('#config_date').on('change',function(){
    $('body').toggleClass('hidedate showdate');
});


init_date();
calculate();