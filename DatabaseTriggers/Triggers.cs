using Dapper;
using System.Data;
namespace Panaderia.DatabaseTriggers;

public class Triggers
{
    private readonly IDbConnection _connection;

    public Triggers(IDbConnection connection)
    {
        _connection = connection;
    }

    public void CreateTriggerInsertCompras()
    {
        _connection.Execute(@"
            CREATE TRIGGER TR_Insert_Compras
            AFTER INSERT ON Compras
            FOR EACH ROW
            BEGIN
                INSERT INTO detalles_de_compras(fk_compra, fk_stock, fl_precio_unidad, int_cantidad, fl_iva)
                VALUES (NEW.id_compra, 1, 0, 0, 0.05);
            END;
        ", commandType: CommandType.Text);
    }

    /*
    public void UpdateTotalPrice()
    {
        _connection.Execute(@"
        CREATE TRIGGER TR_Update_Total_Price
        AFTER INSERT ON detalles_de_compras
        FOR EACH ROW
        BEGIN
            UPDATE compras
            SET fl_precio_total = (
                SELECT SUM(fl_precio_unidad * int_cantidad) 
                FROM detalles_de_compras 
                WHERE fk_compra = NEW.fk_compra
            )
            WHERE id_compra = NEW.fk_compra;
        END;
    ", commandType: CommandType.Text);
    }
*/

    public void DateOnInsertCompras()
    {
        _connection.Execute(@"
        CREATE TRIGGER TR_Date_Compras
        BEFORE INSERT ON Compras
        FOR EACH ROW
        BEGIN
            SET NEW.date_compra = DATE_FORMAT(CURDATE(), '%Y-%m-%d');
        END;
    ", commandType: CommandType.Text);
    }

    public void DateOnFinishOrder()
    {
        _connection.Execute(@"
        CREATE TRIGGER TR_Date_Detalles_Productos
        BEFORE INSERT ON Compras
        FOR EACH ROW
        BEGIN
            SET NEW.date_compra = DATE_FORMAT(CURDATE(), '%Y-%m-%d');
        END;
    ", commandType: CommandType.Text);
    }


    public Boolean TriggerExists(string triggerName)
    {
        var trigger = _connection.QueryFirstOrDefault(@"
            SELECT trigger_name
            FROM information_schema.triggers
            WHERE trigger_schema = 'panaderia' AND trigger_name = @triggerName
        ", new { triggerName }, commandType: CommandType.Text);

        return trigger != null;
    }
}
