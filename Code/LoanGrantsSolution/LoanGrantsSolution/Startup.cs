using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LoanGrantsSolution.Startup))]
namespace LoanGrantsSolution
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
