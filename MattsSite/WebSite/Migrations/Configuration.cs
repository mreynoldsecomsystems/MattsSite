namespace WebSite.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WebSite.Code.WebSiteContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(WebSite.Code.WebSiteContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Topics.AddOrUpdate(
                    new Models.Topic
                    {
                        Title = "Home",
                        Description = "Matt's Web Site Home Page",
                        TopicName = "Home Page",
                        TopicToken = "HOME",
                        MetaDataTitle = "Matt Reynolds",
                        MetaDataDescription = "A digitial portfolio for Matt Reynolds",
                        MetaDataKeywords = "asp.net developer, .net 4.5, asp.net mvc4, responsive design",
                        Body = "this is the home page"
                    },
                    new Models.Topic
                    {
                        Title = "About",
                        Description = "",
                        TopicName = "About Page",
                        TopicToken = "ABOUT",
                        MetaDataTitle = "About Matt Reynolds",
                        MetaDataKeywords = "Matt Reynolds",
                        MetaDataDescription = "",
                        Body = "this is the about page"
                    },
                    new Models.Topic
                    {
                        Title = "Contact Me",
                        Description = "",
                        TopicName = "Contact Page",
                        TopicToken = "CONTACT",
                        MetaDataTitle = "Contact Matt Reynolds",
                        MetaDataKeywords = "",
                        MetaDataDescription = "",
                        Body = "this is the contact me page"
                    }
                );
        }
    }
}
