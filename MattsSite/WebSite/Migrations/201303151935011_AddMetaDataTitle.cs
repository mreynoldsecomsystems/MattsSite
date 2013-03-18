namespace WebSite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddMetaDataTitle : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Topics", "MetaDataTitle", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Topics", "MetaDataTitle");
        }
    }
}
