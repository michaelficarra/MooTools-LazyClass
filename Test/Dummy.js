Dummy = new Class(
{
  initialize: function(a, b)
  {
    alert ('dummy init');
    this.a = a;
    this.b = b;
  },
  getArgs: function()
  {
    return this.a+' and '+this.b;
  }
});
