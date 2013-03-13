namespace WebSite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTagCount : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tags", "TagCount", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tags", "TagCount");
        }
    }
}
